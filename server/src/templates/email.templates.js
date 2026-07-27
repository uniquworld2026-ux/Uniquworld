/**
 * Uniquworld transactional email templates.
 * Table-based, inline CSS for Gmail / Outlook / Apple Mail.
 */

const config = require('../config');

const brand = {
  name: 'Uniquworld',
  tagline: 'Make a Moment, Unique the world',
  accent: '#d92c2b',
  accentSoft: '#fdecec',
  ink: '#0a2d4d',
  muted: '#64748b',
  border: '#e2e8f0',
  bg: '#f8fafc',
  card: '#ffffff',
  white: '#ffffff',
  logoUrl: config.emailLogoUrl || '',
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const brandHeader = () => {
  if (brand.logoUrl) {
    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom:10px;">
            <img
              src="${escapeHtml(brand.logoUrl)}"
              alt="${escapeHtml(brand.name)}"
              width="200"
              style="display:block;border:0;outline:none;text-decoration:none;width:200px;max-width:70%;height:auto;"
            />
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.4;letter-spacing:0.04em;color:${brand.muted};">
              ${escapeHtml(brand.tagline)}
            </p>
          </td>
        </tr>
      </table>`;
  }

  return `
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.2;font-weight:700;color:${brand.ink};">
      ${brand.name}
    </p>
    <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.3;color:${brand.muted};">
      ${escapeHtml(brand.tagline)}
    </p>`;
};

/**
 * Shared shell — header brand bar, white card, footer.
 */
const layout = ({ preheader, title, bodyHtml, footerNote }) => {
  const safePre = escapeHtml(preheader || title);
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${brand.bg};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    ${safePre}
  </div>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${brand.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background-color:${brand.card};border-radius:16px;overflow:hidden;border:1px solid ${brand.border};">
          <!-- Brand header -->
          <tr>
            <td style="background-color:${brand.white};padding:22px 28px 16px;border-bottom:3px solid ${brand.accent};">
              ${brandHeader()}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:${brand.ink};">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:8px 28px 28px;font-family:Arial,Helvetica,sans-serif;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="border-top:1px solid ${brand.border};padding-top:20px;">
                    <p style="margin:0;font-size:12px;line-height:1.6;color:${brand.muted};">
                      ${footerNote || 'If you did not request this email, you can safely ignore it.'}
                    </p>
                    <p style="margin:14px 0 0;font-size:12px;line-height:1.5;color:${brand.muted};">
                      © ${year} ${brand.name}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const heading = (text) =>
  `<h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;font-weight:700;color:${brand.ink};">${text}</h1>`;

const paragraph = (text, { muted = false, top = 0 } = {}) =>
  `<p style="margin:${top}px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${muted ? brand.muted : brand.ink};">${text}</p>`;

/** Large OTP code card */
const otpCodeBlock = (code) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;">
    <tr>
      <td align="center" style="background-color:${brand.accentSoft};border:1px solid ${brand.border};border-radius:12px;padding:22px 16px;">
        <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${brand.muted};font-weight:700;">
          Verification code
        </p>
        <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:34px;line-height:1.2;letter-spacing:10px;font-weight:700;color:${brand.accent};">
          ${escapeHtml(code)}
        </p>
      </td>
    </tr>
  </table>`;

const infoChip = (label, value) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0;background-color:${brand.bg};border:1px solid ${brand.border};border-radius:12px;">
    <tr>
      <td style="padding:16px 18px;">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${brand.muted};font-weight:700;">${escapeHtml(label)}</p>
        <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:${brand.ink};">${escapeHtml(value)}</p>
      </td>
    </tr>
  </table>`;

const PURPOSE_COPY = {
  email_verification: {
    subject: 'Verify your Uniquworld email',
    headline: 'Confirm your email',
    intro: 'Use this code to verify your Uniquworld account and unlock checkout, orders, and saved addresses.',
  },
  password_reset: {
    subject: 'Reset your Uniquworld password',
    headline: 'Password reset',
    intro: 'Use this code to set a new password for your Uniquworld account.',
  },
  login: {
    subject: 'Your Uniquworld sign-in code',
    headline: 'Sign-in verification',
    intro: 'Enter this code to finish signing in to your Uniquworld account.',
  },
  admin_login: {
    subject: 'Your Uniquworld admin sign-in code',
    headline: 'Admin sign-in',
    intro: 'Enter this code to access the Uniquworld admin portal.',
  },
  phone_verification: {
    subject: 'Verify your phone — Uniquworld',
    headline: 'Phone verification',
    intro: 'Use this code to verify your phone number on Uniquworld.',
  },
};

function otpEmail({ code, purpose, firstName, expiresInMinutes }) {
  const copy = PURPOSE_COPY[purpose] || PURPOSE_COPY.login;
  const name = firstName ? escapeHtml(firstName) : 'there';
  const html = layout({
    preheader: `${copy.headline}: your code expires in ${expiresInMinutes} minutes`,
    title: copy.subject,
    bodyHtml: `
      ${heading(copy.headline)}
      ${paragraph(`Hi ${name},`)}
      ${paragraph(copy.intro, { muted: true, top: 10 })}
      ${otpCodeBlock(code)}
      ${paragraph(`This code expires in <strong style="color:${brand.ink};">${expiresInMinutes} minutes</strong>. Do not share it with anyone.`, { muted: true })}
    `,
    footerNote: 'If you did not request this code, you can safely ignore this email. Your account remains secure.',
  });
  const text = [
    `Hi ${firstName || 'there'},`,
    '',
    copy.intro,
    '',
    `Code: ${code}`,
    '',
    `Expires in ${expiresInMinutes} minutes.`,
    '',
    'If you did not request this code, ignore this email.',
    '',
    `— ${brand.name}`,
  ].join('\n');
  return { subject: copy.subject, html, text };
}

function welcomeEmail({ firstName }) {
  const name = escapeHtml(firstName || 'there');
  const subject = `Welcome to ${brand.name}`;
  const html = layout({
    preheader: 'Your account is ready — verify your email to continue.',
    title: subject,
    bodyHtml: `
      ${heading('Welcome aboard')}
      ${paragraph(`Hi ${name},`)}
      ${paragraph(
        `Thank you for joining ${brand.name}. Verify your email with the code we sent, then sign in — every login is protected with a fresh verification code.`,
        { muted: true, top: 10 },
      )}
      ${paragraph(
        'Once verified, you can track orders, save addresses, and receive updates on deliveries.',
        { muted: true, top: 14 },
      )}
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
      ${heading('Password updated')}
      ${paragraph(`Hi ${name},`)}
      ${paragraph(
        'Your password was changed successfully. If this wasn’t you, reset your password again immediately and contact support.',
        { muted: true, top: 10 },
      )}
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
      ${heading(escapeHtml(title))}
      ${paragraph(`Hi ${name},`)}
      ${paragraph(escapeHtml(message), { muted: true, top: 10 })}
      ${infoChip('Order', orderNumber)}
      ${
        totalLabel
          ? paragraph(escapeHtml(totalLabel), { muted: true })
          : ''
      }
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
      ${heading(escapeHtml(title))}
      ${paragraph(`Hi ${name},`)}
      ${paragraph(escapeHtml(body), { muted: true, top: 10 })}
    `,
  });
  const text = `Hi ${firstName || 'there'},\n\n${title}\n${body}\n\n— ${brand.name}`;
  return { subject, html, text };
}

function productActivityEmail({
  firstName,
  title,
  body,
  productName,
  productImage,
  ctaLabel,
  ctaUrl,
}) {
  const name = escapeHtml(firstName || 'there');
  const subject = title;
  const site = (config.clientUrl || 'https://uniquworld.com').replace(/\/$/, '');
  const href = ctaUrl?.startsWith('http') ? ctaUrl : `${site}${ctaUrl || '/'}`;
  const img = productImage
    ? `<img src="${escapeHtml(productImage)}" alt="${escapeHtml(productName || '')}" width="72" height="72" style="display:block;border-radius:10px;object-fit:cover;width:72px;height:72px;border:1px solid ${brand.border};" />`
    : `<div style="width:72px;height:72px;border-radius:10px;background:${brand.bg};border:1px solid ${brand.border};"></div>`;

  const html = layout({
    preheader: body,
    title: subject,
    bodyHtml: `
      ${heading(escapeHtml(title))}
      ${paragraph(`Hi ${name},`)}
      ${paragraph(escapeHtml(body), { muted: true, top: 10 })}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:20px 0;background-color:${brand.bg};border:1px solid ${brand.border};border-radius:12px;">
        <tr>
          <td style="padding:14px 16px;" width="72" valign="middle">${img}</td>
          <td style="padding:14px 16px 14px 8px;" valign="middle">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${brand.muted};font-weight:700;">Product</p>
            <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;color:${brand.ink};">${escapeHtml(productName || 'Gift')}</p>
          </td>
        </tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;">
        <tr>
          <td style="border-radius:10px;background-color:${brand.accent};">
            <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:${brand.white};text-decoration:none;">
              ${escapeHtml(ctaLabel || 'Open Uniquworld')}
            </a>
          </td>
        </tr>
      </table>
    `,
    footerNote: 'You’re receiving this because you interacted with a product while signed in to Uniquworld.',
  });
  const text = [
    `Hi ${firstName || 'there'},`,
    '',
    body,
    '',
    `Product: ${productName || 'Gift'}`,
    ctaLabel ? `${ctaLabel}: ${href}` : '',
    '',
    `— ${brand.name}`,
  ]
    .filter(Boolean)
    .join('\n');
  return { subject, html, text };
}

module.exports = {
  otpEmail,
  welcomeEmail,
  passwordResetSuccessEmail,
  orderEmail,
  notificationEmail,
  productActivityEmail,
};
