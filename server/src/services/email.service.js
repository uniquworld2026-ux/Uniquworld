const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');
const templates = require('../templates/email.templates');

let transporter = null;

const isSmtpConfigured = () => {
  const user = config.smtp.user || '';
  const pass = config.smtp.pass || '';
  if (!config.smtp.host || !user || !pass) return false;
  if (user.includes('your-email') || pass.includes('your-app-password')) return false;
  return true;
};

const getTransporter = () => {
  if (transporter) return transporter;

  if (!isSmtpConfigured()) {
    logger.warn('SMTP not configured — emails will be logged to console');
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
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 */
const sendMail = async ({ to, subject, html, text }) => {
  const transport = getTransporter();
  const from = `"${config.smtp.fromName}" <${config.smtp.fromEmail || config.smtp.user}>`;

  if (!transport) {
    logger.info('[DEV EMAIL]', { to, subject, text: text || '(html)' });
    return { messageId: 'dev-console', accepted: [to] };
  }

  try {
    const result = await transport.sendMail({ from, to, subject, html, text });
    logger.info('Email sent', { to, subject, messageId: result.messageId });
    return result;
  } catch (err) {
    logger.error('Email send failed', { to, subject, message: err.message });
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

module.exports = {
  sendMail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetSuccessEmail,
  sendOrderEmail,
  sendNotificationEmail,
  isSmtpConfigured,
};
