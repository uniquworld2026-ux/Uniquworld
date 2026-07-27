const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');
const templates = require('../templates/email.templates');

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

const getFrom = () => {
  const fromAddress = config.smtp.fromEmail || config.smtp.user;
  return {
    fromAddress,
    from: `${config.smtp.fromName} <${fromAddress}>`,
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

/**
 * Send via Resend API (SPF/DKIM on your domain → Primary inbox).
 * @see https://resend.com/docs/send-with-nodejs
 */
const sendViaResend = async ({ to, subject, html, text }) => {
  const { from } = getFrom();
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

  logger.info('Email sent via Resend', {
    to,
    subject,
    messageId: body.id,
    provider: 'resend',
  });
  return { messageId: body.id, accepted: [to], provider: 'resend' };
};

const sendViaSmtp = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  const { from, fromAddress } = getFrom();

  if (!transport) {
    logger.info('[DEV EMAIL]', { to, subject, text: text || '(html)' });
    return { messageId: 'dev-console', accepted: [to], provider: 'console' };
  }

  // Prefer plain text for OTP-style messages (less likely to hit Gmail Promotions/Spam)
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

  try {
    if (isResendConfigured()) {
      return await sendViaResend(content);
    }
    if (!isSmtpConfigured()) {
      logger.warn('No email provider configured — logging to console');
      logger.info('[DEV EMAIL]', { to, subject, text: text || '(html)' });
      return { messageId: 'dev-console', accepted: [to], provider: 'console' };
    }
    return await sendViaSmtp(content);
  } catch (err) {
    logger.error('Email send failed', {
      to,
      subject,
      message: err.message,
      provider: isResendConfigured() ? 'resend' : 'smtp',
    });
    throw err;
  }
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

module.exports = {
  sendMail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetSuccessEmail,
  sendOrderEmail,
  sendNotificationEmail,
  sendProductActivityEmail,
  isSmtpConfigured,
  isResendConfigured,
  isEmailConfigured,
};
