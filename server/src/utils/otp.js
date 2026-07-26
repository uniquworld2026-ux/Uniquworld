const crypto = require('crypto');
const config = require('../config');

const generateOtpCode = (length = config.otp.length) => {
  const max = 10 ** length;
  const num = crypto.randomInt(0, max);
  return String(num).padStart(length, '0');
};

const otpExpiresAt = () =>
  new Date(Date.now() + config.otp.expiresInMinutes * 60 * 1000);

module.exports = {
  generateOtpCode,
  otpExpiresAt,
};
