const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!config.smtp.host || !config.smtp.user) {
    logger.warn('SMTP not configured — emails will be logged to console in development');
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
  const from = `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`;

  if (!transport) {
    logger.info('[DEV EMAIL]', { to, subject, text: text || html });
    return { messageId: 'dev-console', accepted: [to] };
  }

  return transport.sendMail({ from, to, subject, html, text });
};

const sendOtpEmail = async ({ to, code, purpose, firstName }) => {
  const purposeLabel = {
    email_verification: 'Email Verification',
    password_reset: 'Password Reset',
    login: 'Login Verification',
    phone_verification: 'Phone Verification',
  }[purpose] || 'Verification';

  const subject = `${config.appName} — ${purposeLabel} OTP`;
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';
  const text = `${greeting}\n\nYour OTP is ${code}. It expires in ${config.otp.expiresInMinutes} minutes.\n\nIf you did not request this, ignore this email.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
      <h2>${config.appName}</h2>
      <p>${greeting}</p>
      <p>Your <strong>${purposeLabel}</strong> OTP is:</p>
      <p style="font-size:28px;letter-spacing:6px;font-weight:bold">${code}</p>
      <p>This code expires in <strong>${config.otp.expiresInMinutes} minutes</strong>.</p>
      <p style="color:#666;font-size:12px">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  return sendMail({ to, subject, html, text });
};

const sendWelcomeEmail = async ({ to, firstName }) => {
  const subject = `Welcome to ${config.appName}`;
  const text = `Hi ${firstName},\n\nWelcome to ${config.appName}! Your account is ready.`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
      <h2>Welcome to ${config.appName}</h2>
      <p>Hi ${firstName},</p>
      <p>Your account has been created successfully. Happy shopping!</p>
    </div>
  `;
  return sendMail({ to, subject, html, text });
};

module.exports = {
  sendMail,
  sendOtpEmail,
  sendWelcomeEmail,
};
