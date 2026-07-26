const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/jwt');
const userRepository = require('../repositories/user.repository');
const { USER_STATUS } = require('../types/enums');

/**
 * Require a valid Bearer access token.
 */
const authenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token required');
    }

    const token = header.slice(7);
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch {
      throw ApiError.unauthorized('Invalid or expired access token');
    }

    const user = await userRepository.findByIdWithRole(payload.sub);
    if (!user || user.deleted_at) {
      throw ApiError.unauthorized('User not found');
    }

    if (user.status === USER_STATUS.BANNED) {
      throw ApiError.forbidden('Account is banned');
    }

    if (user.status === USER_STATUS.INACTIVE) {
      throw ApiError.forbidden('Account is inactive');
    }

    req.user = user;
    req.tokenPayload = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Optional auth — attaches user when token is present and valid.
 */
const optionalAuthenticate = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next();
    }

    const token = header.slice(7);
    const payload = verifyAccessToken(token);
    const user = await userRepository.findByIdWithRole(payload.sub);
    if (user && !user.deleted_at && user.status === USER_STATUS.ACTIVE) {
      req.user = user;
      req.tokenPayload = payload;
    }
    return next();
  } catch {
    return next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};
