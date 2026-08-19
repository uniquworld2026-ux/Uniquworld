const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');
const templates = require('../templates/email.templates');

/** Resend allows this from-address before your own domain is verified. */
const RESEND_ONBOARDING_FROM = 'beth.t@example.com';

let transporter = null;

const isResendConfigured = () => Boolean(config.resend.apiKey && !config.resend.apiKey.includes('re_xxxx'));

const isSmtpConfigured = () => {
  const user = config.smtp.user || '';
  const pass = config.smtp.pass || '';
  if (!config.smtp.host || !user || !pass) return false;
  if (user.includes('your-email') || pass.includes('your-app-password')) return false;
  return true;
};

const isEmailConfigured = () => isResendConfigured() || isSmtpConfigured();

const domainOf = (email) => {
  const at = String(email || '').lastIndexOf('@');
  return at >= 0 ? String(email).slice(at + 1).toLowerCase() : '';
};

/**
 * From address for Resend. Use the configured domain once it is verified at
 * https://resend.com/domains (Sending capability). Set
 * RESEND_FORCE_ONBOARDING=true only on a Resend trial key that still allows
 * beth.t@example.com.
 */
const getResendFrom = () => {
  const configured =
    process.env.RESEND_FROM_EMAIL ||
    config.smtp.fromEmail ||
    RESEND_ONBOARDING_FROM;
  const domain = domainOf(configured);
  const useOnboarding =
    process.env.RESEND_FORCE_ONBOARDING === 'true' || !domain;

  const fromAddress = useOnboarding ? RESEND_ONBOARDING_FROM : configured;
  if (useOnboarding && configured !== RESEND_ONBOARDING_FROM) {
    logger.warn(
      'Resend FROM uses beth.t@example.com (RESEND_FORCE_ONBOARDING). Prefer a verified domain at https://resend.com/domains',
      { configured }
    );
  }
  return {
    fromAddress,
    from: `${config.smtp.fromName || 'Uniquworld'} <${fromAddress}>`,
  };
};

const getSmtpFrom = () => {
  // Gmail SMTP must send as the authenticated mailbox (or a verified alias).
  const fromAddress = config.smtp.user || config.smtp.fromEmail;
  return {
    fromAddress,
    from: `${config.smtp.fromName || 'Uniquworld'} <${fromAddress}>`,
  };
};

const getTransporter = () => {
  if (transporter) return transporter;

  if (!isSmtpConfigured()) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  return transporter;
};

const postResend = async ({ from, to, subject, html, text }) => {
  const payload = {
    from,
    to: [to],
    subject,
    text: text || undefined,
    ...(html ? { html } : {}),
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resend.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.message || body?.error || response.statusText || 'Resend request failed';
    throw new Error(message);
  }

  return body;
};

/**
 * Send via Resend API. Falls back to onboarding from-address on domain errors.
 * @see https://resend.com/docs/send-with-nodejs
 */
const sendViaResend = async ({ to, subject, html, text }) => {
  const primary = getResendFrom();

  try {
    const body = await postResend({
      from: primary.from,
      to,
      subject,
      html,
      text,
    });
    logger.info('Email sent via Resend', {
      to,
      subject,
      messageId: body.id,
      from: primary.fromAddress,
      provider: 'resend',
    });
    return { messageId: body.id, accepted: [to], provider: 'resend' };
  } catch (err) {
    const msg = String(err.message || '');
    const domainIssue = /domain is not verified|not verified/i.test(msg);
    const alreadyOnboarding = primary.fromAddress === RESEND_ONBOARDING_FROM;
    if (domainIssue && !alreadyOnboarding) {
      logger.warn(
        'Resend domain not verified — retrying with beth.t@example.com (trial sender only)',
        { to, from: primary.fromAddress }
      );
      try {
        const body = await postResend({
          from: `Uniquworld <${RESEND_ONBOARDING_FROM}>`,
          to,
          subject,
          html,
          text,
        });
        logger.info('Email sent via Resend (onboarding from)', {
          to,
          subject,
          messageId: body.id,
          provider: 'resend',
        });
        return { messageId: body.id, accepted: [to], provider: 'resend' };
      } catch (onboardingErr) {
        throw new Error(
          `${msg} Onboarding sender also failed (${onboardingErr.message}). Finish Sending verification at https://resend.com/domains — Partially Verified (receiving only) is not enough.`
        );
      }
    }
    throw err;
  }
};

const sendViaSmtp = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  const { from, fromAddress } = getSmtpFrom();

  if (!transport) {
    logger.info('[DEV EMAIL]', { to, subject, text: text || '(html)' });
    return { messageId: 'dev-console', accepted: [to], provider: 'console' };
  }

  const mail = {
    from,
    replyTo: fromAddress,
    to,
    subject,
    text: text || undefined,
    ...(html ? { html } : {}),
    headers: {
      'Auto-Submitted': 'auto-generated',
    },
  };

  const result = await transport.sendMail(mail);

  if (result.rejected?.length) {
    throw new Error(`Email rejected for: ${result.rejected.join(', ')}`);
  }

  logger.info('Email sent via SMTP', {
    to,
    subject,
    messageId: result.messageId,
    accepted: result.accepted,
    provider: 'smtp',
    response: result.response,
  });
  return { ...result, provider: 'smtp' };
};

/**
 * @param {{ to: string, subject: string, html?: string, text?: string, textOnly?: boolean }} options
 */
const sendMail = async ({ to, subject, html, text, textOnly = false }) => {
  const content = {
    to,
    subject,
    text,
    html: textOnly ? undefined : html,
  };

  let lastError = null;

  if (isResendConfigured()) {
    try {
      return await sendViaResend(content);
    } catch (err) {
      lastError = err;
      logger.warn('Resend send failed — trying SMTP fallback if configured', {
        to,
        subject,
        message: err.message,
      });
    }
  }

  if (isSmtpConfigured()) {
    try {
      return await sendViaSmtp(content);
    } catch (err) {
      lastError = err;
      logger.error('SMTP send failed', { to, subject, message: err.message });
    }
  }

  if (!isResendConfigured() && !isSmtpConfigured()) {
    logger.warn('No email provider configured — logging to console');
    logger.info('[DEV EMAIL]', { to, subject, text: text || '(html)' });
    return { messageId: 'dev-console', accepted: [to], provider: 'console' };
  }

  logger.error('Email send failed', {
    to,
    subject,
    message: lastError?.message,
    provider: isResendConfigured() ? 'resend' : 'smtp',
  });
  throw lastError || new Error('Email send failed');
};

const sendOtpEmail = async ({ to, code, purpose, firstName }) => {
  const { subject, html, text } = templates.otpEmail({
    code,
    purpose,
    firstName,
    expiresInMinutes: config.otp.expiresInMinutes,
  });
  return sendMail({ to, subject, html, text });
};

const sendWelcomeEmail = async ({ to, firstName }) => {
  const { subject, html, text } = templates.welcomeEmail({ firstName });
  return sendMail({ to, subject, html, text });
};

const sendPasswordResetSuccessEmail = async ({ to, firstName }) => {
  const { subject, html, text } = templates.passwordResetSuccessEmail({ firstName });
  return sendMail({ to, subject, html, text });
};

const sendOrderEmail = async ({ to, firstName, orderNumber, title, message, totalLabel }) => {
  const { subject, html, text } = templates.orderEmail({
    firstName,
    orderNumber,
    title,
    message,
    totalLabel,
  });
  return sendMail({ to, subject, html, text });
};

const sendNotificationEmail = async ({ to, firstName, title, body }) => {
  const { subject, html, text } = templates.notificationEmail({ firstName, title, body });
  return sendMail({ to, subject, html, text });
};

const sendProductActivityEmail = async ({
  to,
  firstName,
  title,
  body,
  productName,
  productImage,
  ctaLabel,
  ctaUrl,
}) => {
  const { subject, html, text } = templates.productActivityEmail({
    firstName,
    title,
    body,
    productName,
    productImage,
    ctaLabel,
    ctaUrl,
  });
  return sendMail({ to, subject, html, text });
};

const sendStorePartnerWelcomeEmail = async ({ to, firstName, storeName }) => {
  const { subject, html, text } = templates.storePartnerWelcomeEmail({ firstName, storeName });
  return sendMail({ to, subject, html, text });
};

const sendStorePartnerInviteEmail = async ({ to, firstName, storeName, tempPassword, loginUrl }) => {
  const { subject, html, text } = templates.storePartnerInviteEmail({
    firstName,
    storeName,
    tempPassword,
    loginUrl,
  });
  return sendMail({ to, subject, html, text });
};

const sendAccountCredentialsEmail = async ({ to, firstName, email, tempPassword, loginUrl }) => {
  const { subject, html, text } = templates.accountCredentialsEmail({
    firstName,
    email,
    tempPassword,
    loginUrl,
  });
  return sendMail({ to, subject, html, text });
};

module.exports = {
  sendMail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetSuccessEmail,
  sendOrderEmail,
  sendNotificationEmail,
  sendProductActivityEmail,
  sendStorePartnerWelcomeEmail,
  sendStorePartnerInviteEmail,
  sendAccountCredentialsEmail,
  isSmtpConfigured,
  isResendConfigured,
  isEmailConfigured,
};
