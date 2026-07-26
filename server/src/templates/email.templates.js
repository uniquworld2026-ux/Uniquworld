/**
 * Professional transactional email templates for Uniquworld.
 * Inline styles for Gmail / Outlook compatibility.
 */

const brand = {
  name: 'Uniquworld',
  accent: '#1a5c4a',
  ink: '#1c1917',
  muted: '#78716c',
  border: '#e7e5e4',
  bg: '#fafaf9',
  card: '#ffffff',
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const layout = ({ preheader, title, bodyHtml, footerNote }) => {
  const safePre = escapeHtml(preheader || title);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${brand.bg};font-family:Georgia,'Times New Roman',serif;color:${brand.ink};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${safePre}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${brand.card};border:1px solid ${brand.border};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 12px;border-bottom:1px solid ${brand.border};">
              <p style="margin:0;font-size:22px;letter-spacing:0.02em;color:${brand.accent};font-weight:700;">${brand.name}</p>
              <p style="margin:6px 0 0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${brand.muted};font-family:Arial,Helvetica,sans-serif;">Thoughtful gifting</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:${brand.muted};">
                ${footerNote || 'If you did not request this, you can safely ignore this email.'}
              </p>
              <p style="margin:16px 0 0;font-size:12px;color:${brand.muted};">
                © ${new Date().getFullYear()} ${brand.name}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const otpBlock = (code) => `
  <div style="margin:24px 0;padding:20px;text-align:center;background:${brand.bg};border:1px dashed ${brand.border};border-radius:12px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${brand.muted};">One-time password</p>
    <p style="margin:0;font-size:32px;letter-spacing:10px;font-weight:700;color:${brand.ink};font-family:'Courier New',Courier,monospace;">${escapeHtml(code)}</p>
  </div>`;

const PURPOSE_COPY = {
  email_verification: {
    subject: 'Verify your Uniquworld email',
    headline: 'Confirm your email',
    intro: 'Use this code to verify your account and unlock checkout, orders, and saved addresses.',
  },
  password_reset: {
    subject: 'Reset your Uniquworld password',
    headline: 'Password reset code',
    intro: 'Use this code to set a new password for your Uniquworld account.',
  },
  login: {
    subject: 'Your Uniquworld login code',
    headline: 'Sign-in verification',
    intro: 'Enter this code to finish signing in. For your security, we never sign you in with a password alone.',
  },
  admin_login: {
    subject: 'Uniquworld admin login code',
    headline: 'Admin portal verification',
    intro: 'Enter this code to access the Uniquworld admin portal. Do not share it with anyone.',
  },
  phone_verification: {
    subject: 'Verify your phone — Uniquworld',
    headline: 'Phone verification',
    intro: 'Use this code to verify your phone number.',
  },
};

function otpEmail({ code, purpose, firstName, expiresInMinutes }) {
  const copy = PURPOSE_COPY[purpose] || PURPOSE_COPY.login;
  const name = firstName ? escapeHtml(firstName) : 'there';
  const html = layout({
    preheader: `${copy.headline}: ${code}`,
    title: copy.subject,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:${brand.ink};font-family:Georgia,serif;">${copy.headline}</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;color:${brand.ink};">Hi ${name},</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${brand.muted};">${copy.intro}</p>
      ${otpBlock(code)}
      <p style="margin:0;font-size:14px;color:${brand.muted};">This code expires in <strong style="color:${brand.ink};">${expiresInMinutes} minutes</strong>.</p>
    `,
  });
  const text = `Hi ${firstName || 'there'},\n\n${copy.intro}\n\nOTP: ${code}\nExpires in ${expiresInMinutes} minutes.\n\n— ${brand.name}`;
  return { subject: copy.subject, html, text };
}

function welcomeEmail({ firstName }) {
  const name = escapeHtml(firstName || 'there');
  const subject = `Welcome to ${brand.name}`;
  const html = layout({
    preheader: 'Your account is ready — verify your email to continue.',
    title: subject,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:22px;color:${brand.ink};font-family:Georgia,serif;">Welcome aboard</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;">Hi ${name},</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${brand.muted};">
        Thank you for joining ${brand.name}. Verify your email with the OTP we just sent, then sign in — every login is protected with a fresh verification code.
      </p>
      <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:${brand.muted};">
        Once verified, you can track orders, save addresses, and receive updates on deliveries and surprises.
      </p>
    `,
    footerNote: 'Questions? Reply to this email and our team will help.',
  });
  const text = `Hi ${firstName || 'there'},\n\nWelcome to ${brand.name}. Verify your email with the OTP we sent, then sign in.\n\n— ${brand.name}`;
  return { subject, html, text };
}

function passwordResetSuccessEmail({ firstName }) {
  const name = escapeHtml(firstName || 'there');
  const subject = 'Your Uniquworld password was updated';
  const html = layout({
    preheader: 'Password changed successfully',
    title: subject,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:22px;color:${brand.ink};font-family:Georgia,serif;">Password updated</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;">Hi ${name},</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${brand.muted};">
        Your password was changed successfully. If this wasn’t you, reset your password again immediately and contact support.
      </p>
    `,
  });
  const text = `Hi ${firstName || 'there'},\n\nYour Uniquworld password was updated.\n\n— ${brand.name}`;
  return { subject, html, text };
}

function orderEmail({ firstName, orderNumber, title, message, totalLabel }) {
  const name = escapeHtml(firstName || 'there');
  const subject = title;
  const html = layout({
    preheader: message,
    title: subject,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:22px;color:${brand.ink};font-family:Georgia,serif;">${escapeHtml(title)}</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;">Hi ${name},</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${brand.muted};">${escapeHtml(message)}</p>
      <div style="margin:20px 0;padding:16px;border:1px solid ${brand.border};border-radius:12px;background:${brand.bg};">
        <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${brand.muted};">Order</p>
        <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:${brand.ink};">${escapeHtml(orderNumber)}</p>
        ${totalLabel ? `<p style="margin:10px 0 0;font-size:14px;color:${brand.muted};">${escapeHtml(totalLabel)}</p>` : ''}
      </div>
    `,
    footerNote: 'You can track this order anytime from your Uniquworld account.',
  });
  const text = `Hi ${firstName || 'there'},\n\n${message}\n\nOrder: ${orderNumber}${totalLabel ? `\n${totalLabel}` : ''}\n\n— ${brand.name}`;
  return { subject, html, text };
}

function notificationEmail({ firstName, title, body }) {
  const name = escapeHtml(firstName || 'there');
  const subject = title;
  const html = layout({
    preheader: body,
    title: subject,
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:22px;color:${brand.ink};font-family:Georgia,serif;">${escapeHtml(title)}</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;">Hi ${name},</p>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${brand.muted};">${escapeHtml(body)}</p>
    `,
  });
  const text = `Hi ${firstName || 'there'},\n\n${title}\n${body}\n\n— ${brand.name}`;
  return { subject, html, text };
}

module.exports = {
  otpEmail,
  welcomeEmail,
  passwordResetSuccessEmail,
  orderEmail,
  notificationEmail,
};
