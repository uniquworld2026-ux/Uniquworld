const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');

const signAccessToken = (payload) =>
  jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: config.appName,
  });

const signRefreshToken = (payload) =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: config.appName,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, config.jwt.accessSecret, { issuer: config.appName });

const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret, { issuer: config.appName });

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const generateOpaqueToken = (bytes = 48) =>
  crypto.randomBytes(bytes).toString('hex');

/**
 * Parse duration like 15m / 7d into Date.
 * @param {string} expiresIn
 */
const expiresAtFromDuration = (expiresIn) => {
  const match = String(expiresIn).match(/^(\d+)([smhd])$/i);
  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return new Date(Date.now() + value * multipliers[unit]);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  generateOpaqueToken,
  expiresAtFromDuration,
};
