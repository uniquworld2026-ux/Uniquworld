const config = require('../config');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  expiresAtFromDuration,
} = require('../utils/jwt');
const refreshTokenRepository = require('../repositories/refreshToken.repository');
const roleRepository = require('../repositories/role.repository');
const ApiError = require('../utils/ApiError');

/**
 * Issue access + refresh tokens and persist hashed refresh token.
 */
const issueTokenPair = async (user, meta = {}) => {
  const permissions = await roleRepository.getPermissionSlugsByRoleId(user.role_id);

  const accessPayload = {
    sub: user.id,
    email: user.email,
    role: user.role_slug || user.role?.slug,
  };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = signRefreshToken({ sub: user.id });

  await refreshTokenRepository.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: expiresAtFromDuration(config.jwt.refreshExpiresIn),
    userAgent: meta.userAgent,
    ipAddress: meta.ipAddress,
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.accessExpiresIn,
    permissions,
  };
};

/**
 * Rotate refresh token: validate, revoke old, issue new pair.
 */
const rotateRefreshToken = async (refreshToken, meta = {}) => {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const tokenHash = hashToken(refreshToken);
  const stored = await refreshTokenRepository.findValidByHash(tokenHash);

  if (!stored || stored.user_id !== payload.sub) {
    throw ApiError.unauthorized('Refresh token revoked or not found');
  }

  await refreshTokenRepository.revokeById(stored.id);

  return { userId: payload.sub, meta };
};

const revokeRefreshToken = async (refreshToken) => {
  if (!refreshToken) return;
  await refreshTokenRepository.revokeByHash(hashToken(refreshToken));
};

module.exports = {
  issueTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
};
