const crypto = require('crypto');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { hashPassword, comparePassword } = require('../utils/password');
const { hashToken } = require('../utils/jwt');
const { generateOtpCode, otpExpiresAt } = require('../utils/otp');
const { toPublicUser } = require('../models/user.model');
const { USER_STATUS, OTP_PURPOSE, ROLES } = require('../types/enums');

const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const otpRepository = require('../repositories/otp.repository');
const refreshTokenRepository = require('../repositories/refreshToken.repository');
const emailService = require('./email.service');
const tokenService = require('./token.service');
const { verifySupabaseJwt } = require('../utils/supabaseJwt');

const createAndSendOtp = async ({ userId, email, purpose, firstName }) => {
  const code = generateOtpCode();
  const codeHash = hashToken(code);

  await otpRepository.create({
    userId,
    email,
    codeHash,
    purpose,
    expiresAt: otpExpiresAt(),
    maxAttempts: config.otp.maxAttempts,
  });

  try {
    await emailService.sendOtpEmail({ to: email, code, purpose, firstName });
  } catch (err) {
    // Keep the OTP row so verification still works; surface code in non-production.
    logger.error('OTP email failed — account/OTP still created', {
      email,
      purpose,
      message: err.message,
    });
    if (config.env !== 'production') {
      logger.info('[DEV OTP]', { email, purpose, code });
      return {
        expiresInMinutes: config.otp.expiresInMinutes,
        delivered: false,
        emailError: err.message,
        // Helps local testing when mail providers reject the domain
        debugCode: code,
      };
    }
    throw ApiError.badRequest(
      `Could not send email (${err.message}). Verify your domain at https://resend.com/domains or check SMTP settings.`
    );
  }

  return {
    expiresInMinutes: config.otp.expiresInMinutes,
    delivered: true,
  };
};

const verifyOtpCode = async ({ email, purpose, code }) => {
  const otp = await otpRepository.findLatestActive(email, purpose);
  if (!otp) {
    throw ApiError.badRequest('OTP expired or not found. Request a new one.');
  }

  if (otp.attempts >= otp.max_attempts) {
    throw ApiError.tooManyRequests('Maximum OTP attempts exceeded');
  }

  const valid = hashToken(code) === otp.code_hash;
  if (!valid) {
    await otpRepository.incrementAttempts(otp.id);
    throw ApiError.badRequest('Invalid OTP');
  }

  await otpRepository.markVerified(otp.id);
  return otp;
};

const nameFromEmail = (email) => {
  const local = String(email || '').split('@')[0] || 'Guest';
  return local
    .replace(/[._+-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
    .slice(0, 50) || 'Guest';
};

const checkoutStart = async ({ email, firstName }) => {
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase();
  if (!normalizedEmail) {
    throw ApiError.badRequest('Email is required');
  }

  const displayName = String(firstName || '').trim() || nameFromEmail(normalizedEmail);
  let user = await userRepository.findByEmail(normalizedEmail);

  if (user) {
    if (String(firstName || '').trim()) {
      await userRepository.updateById(user.id, { firstName: String(firstName).trim() });
      user = await userRepository.findById(user.id);
    }

    if (user.status === USER_STATUS.BANNED) {
      throw ApiError.forbidden('Account is banned');
    }
    if (user.status === USER_STATUS.INACTIVE) {
      throw ApiError.forbidden('Account is inactive');
    }

    const purpose =
      !user.email_verified_at || user.status === USER_STATUS.PENDING
        ? OTP_PURPOSE.EMAIL_VERIFICATION
        : null;

    if (!purpose) {
      return {
        requiresOtp: false,
        requiresPassword: true,
        isVerified: true,
        email: normalizedEmail,
        isNewUser: false,
        message: 'Email already verified. Sign in with your password to continue.',
      };
    }

    const otpMeta = await createAndSendOtp({
      userId: user.id,
      email: user.email,
      purpose,
      firstName: user.first_name || displayName,
    });

    return {
      requiresOtp: true,
      purpose,
      email: normalizedEmail,
      isNewUser: false,
      message: 'Verify your email with the OTP we sent to continue checkout.',
      otp: otpMeta,
    };
  }

  const tempPassword = crypto.randomBytes(6).toString('base64url').slice(0, 10);
  const passwordHash = await hashPassword(tempPassword);
  const roleId = await roleRepository.resolveRoleId(ROLES.CUSTOMER);

  user = await userRepository.create({
    email: normalizedEmail,
    passwordHash,
    firstName: displayName,
    lastName: null,
    phone: null,
    roleId,
    status: USER_STATUS.PENDING,
  });

  const withRole = await userRepository.findById(user.id);
  const otpMeta = await createAndSendOtp({
    userId: user.id,
    email: normalizedEmail,
    purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
    firstName: displayName,
  });

  try {
    await emailService.sendAccountCredentialsEmail({
      to: normalizedEmail,
      firstName: displayName,
      email: normalizedEmail,
      tempPassword,
      loginUrl: `${config.clientUrl}/login`,
    });
  } catch (err) {
    logger.warn('Account credentials email skipped', { email: normalizedEmail, message: err.message });
  }

  return {
    requiresOtp: true,
    purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
    email: normalizedEmail,
    isNewUser: true,
    message: 'We created your account and emailed your login details. Enter the OTP to verify and continue.',
    user: toPublicUser(withRole),
    otp: otpMeta,
  };
};

const register = async (payload) => {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    throw ApiError.conflict('Email is already registered');
  }

  // Auto-generate a random password when the client doesn't supply one
  const tempPassword = payload.password || crypto.randomBytes(6).toString('base64url').slice(0, 10);
  const passwordHash = await hashPassword(tempPassword);
  const roleSlug = payload.role === ROLES.CORPORATE ? ROLES.CORPORATE : ROLES.CUSTOMER;
  const roleId = await roleRepository.resolveRoleId(roleSlug);

  const user = await userRepository.create({
    email: payload.email,
    passwordHash,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    roleId,
    status: USER_STATUS.PENDING,
  });

  const withRole = await userRepository.findById(user.id);
  const otpMeta = await createAndSendOtp({
    userId: user.id,
    email: user.email,
    purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
    firstName: user.first_name,
  });

  // Email the auto-generated password so the user can log in after verification
  if (!payload.password) {
    try {
      await emailService.sendAccountCredentialsEmail({
        to: user.email,
        firstName: user.first_name,
        email: user.email,
        tempPassword,
        loginUrl: `${config.clientUrl}/login`,
      });
    } catch (err) {
      logger.warn('Credentials email skipped', { email: user.email, message: err.message });
    }
  } else {
    try {
      await emailService.sendWelcomeEmail({
        to: user.email,
        firstName: user.first_name,
      });
    } catch (err) {
      logger.warn('Welcome email skipped', { email: user.email, message: err.message });
    }
  }

  return {
    user: toPublicUser(withRole),
    otp: {
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
      ...otpMeta,
    },
  };
};

const login = async ({ email, password }, meta = {}) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.password_hash) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const match = await comparePassword(password, user.password_hash);
  if (!match) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (user.status === USER_STATUS.BANNED) {
    throw ApiError.forbidden('Account is banned');
  }

  if (user.status === USER_STATUS.INACTIVE) {
    throw ApiError.forbidden('Account is inactive');
  }

  // Unverified accounts must complete email verification OTP first (once)
  if (!user.email_verified_at || user.status === USER_STATUS.PENDING) {
    const otpMeta = await createAndSendOtp({
      userId: user.id,
      email: user.email,
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
      firstName: user.first_name,
    });

    return {
      requiresOtp: true,
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
      email: user.email,
      message: 'Verify your email with the OTP we just sent. After that you can sign in with email and password.',
      otp: otpMeta,
    };
  }

  await userRepository.touchLastLogin(user.id);
  const tokens = await tokenService.issueTokenPair(user, meta);

  return {
    requiresOtp: false,
    user: toPublicUser({ ...user, permissions: tokens.permissions }),
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    },
  };
};

const logout = async (refreshToken) => {
  await tokenService.revokeRefreshToken(refreshToken);
  return { loggedOut: true };
};

const refresh = async (refreshToken, meta = {}) => {
  const { userId } = await tokenService.rotateRefreshToken(refreshToken, meta);
  const user = await userRepository.findById(userId);

  if (!user || user.status !== USER_STATUS.ACTIVE) {
    throw ApiError.unauthorized('Unable to refresh session');
  }

  const tokens = await tokenService.issueTokenPair(user, meta);
  return {
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    },
  };
};

const forgotPassword = async (email) => {
  const user = await userRepository.findByEmail(email);

  // Always return success to avoid email enumeration
  if (!user) {
    return {
      message: 'If the email exists, an OTP has been sent',
    };
  }

  const otpMeta = await createAndSendOtp({
    userId: user.id,
    email: user.email,
    purpose: OTP_PURPOSE.PASSWORD_RESET,
    firstName: user.first_name,
  });

  return {
    message: 'If the email exists, an OTP has been sent',
    ...(config.env === 'development' ? { otp: otpMeta } : {}),
  };
};

const resetPassword = async ({ email, code, newPassword }) => {
  await verifyOtpCode({
    email,
    purpose: OTP_PURPOSE.PASSWORD_RESET,
    code,
  });

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.updatePassword(user.id, passwordHash);
  await refreshTokenRepository.revokeAllForUser(user.id);

  await emailService.sendPasswordResetSuccessEmail({
    to: user.email,
    firstName: user.first_name,
  });

  return { message: 'Password reset successful. Please login.' };
};

const verifyOtp = async ({ email, code, purpose }, meta = {}) => {
  const otp = await verifyOtpCode({ email, purpose, code });

  if (purpose === OTP_PURPOSE.EMAIL_VERIFICATION) {
    const userId = otp.user_id;
    if (!userId) {
      const user = await userRepository.findByEmail(email);
      if (!user) throw ApiError.notFound('User not found');
      await userRepository.markEmailVerified(user.id);
    } else {
      await userRepository.markEmailVerified(userId);
    }

    const user = await userRepository.findByEmail(email);
    if (!user) throw ApiError.notFound('User not found');
    if (user.status === USER_STATUS.BANNED) {
      throw ApiError.forbidden('Account is banned');
    }
    if (user.status === USER_STATUS.INACTIVE) {
      throw ApiError.forbidden('Account is inactive');
    }

    // Activate marketplace store after owner verifies email
    if (user.role_slug === ROLES.STORE_OWNER) {
      try {
        const storePartnerService = require('./storePartner.service');
        await storePartnerService.activateStoreAfterEmailVerify(user.id);
      } catch (err) {
        logger.warn('Store activation after verify failed', { userId: user.id, message: err.message });
      }
    }

    // Sign in after first OTP so the browser keeps the session
    await userRepository.touchLastLogin(user.id);
    const tokens = await tokenService.issueTokenPair(user, meta);

    return {
      verified: true,
      purpose,
      message:
        user.role_slug === ROLES.STORE_OWNER
          ? 'Email verified. Your store is ready — sign in to upload products and manage sales.'
          : 'Email verified. You are signed in.',
      user: toPublicUser({ ...user, permissions: tokens.permissions }),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    };
  }

  if (purpose === OTP_PURPOSE.LOGIN) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw ApiError.notFound('User not found');
    if (user.status === USER_STATUS.BANNED) {
      throw ApiError.forbidden('Account is banned');
    }
    if (user.status === USER_STATUS.INACTIVE) {
      throw ApiError.forbidden('Account is inactive');
    }

    await userRepository.touchLastLogin(user.id);
    const tokens = await tokenService.issueTokenPair(user, meta);

    return {
      verified: true,
      purpose,
      user: toPublicUser({ ...user, permissions: tokens.permissions }),
      tokens: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    };
  }

  const user = await userRepository.findByEmail(email);
  return {
    verified: true,
    purpose,
    user: toPublicUser(user),
  };
};

const resendOtp = async ({ email, purpose }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // Avoid enumeration
    return {
      message: 'If the email exists, an OTP has been sent',
    };
  }

  if (
    purpose === OTP_PURPOSE.EMAIL_VERIFICATION &&
    user.email_verified_at
  ) {
    throw ApiError.badRequest('Email is already verified');
  }

  const otpMeta = await createAndSendOtp({
    userId: user.id,
    email: user.email,
    purpose,
    firstName: user.first_name,
  });

  return {
    message: 'OTP sent successfully',
    otp: {
      purpose,
      ...otpMeta,
    },
  };
};

/**
 * Google / Supabase OAuth login.
 * Prefer sending `idToken` (Supabase access token) — verified via project JWKS.
 * Falls back to client-provided profile fields when token is omitted (dev/legacy).
 */
const googleLogin = async (profile, meta = {}) => {
  let googleId = profile.googleId;
  let email = profile.email;
  let firstName = profile.firstName;
  let lastName = profile.lastName;
  let avatarUrl = profile.avatarUrl;

  if (profile.idToken) {
    const payload = await verifySupabaseJwt(profile.idToken);
    email = (payload.email || email || '').toLowerCase();
    googleId =
      payload.sub ||
      payload.user_metadata?.provider_id ||
      payload.user_metadata?.sub ||
      googleId;
    firstName =
      firstName ||
      payload.user_metadata?.full_name?.split(' ')?.[0] ||
      payload.user_metadata?.name ||
      'Google';
    lastName =
      lastName ||
      payload.user_metadata?.full_name?.split(' ')?.slice(1).join(' ') ||
      null;
    avatarUrl = avatarUrl || payload.user_metadata?.avatar_url || null;
  }

  if (!googleId || !email) {
    throw ApiError.badRequest('Invalid Google profile — provide idToken or googleId + email');
  }

  let user = await userRepository.findByGoogleId(googleId);

  if (!user) {
    user = await userRepository.findByEmail(email);

    if (user) {
      await userRepository.updateById(user.id, {
        googleId,
        avatarUrl: avatarUrl || user.avatar_url,
        emailVerifiedAt: user.email_verified_at || new Date().toISOString(),
        status: USER_STATUS.ACTIVE,
      });
      user = await userRepository.findById(user.id);
    } else {
      const created = await userRepository.create({
        email,
        passwordHash: null,
        firstName: firstName || 'Google',
        lastName: lastName || null,
        phone: null,
        roleId: await roleRepository.resolveRoleId(ROLES.CUSTOMER),
        status: USER_STATUS.ACTIVE,
        googleId,
        emailVerifiedAt: new Date().toISOString(),
        avatarUrl: avatarUrl || null,
      });
      user = await userRepository.findById(created.id);
    }
  }

  if (user.status === USER_STATUS.BANNED) {
    throw ApiError.forbidden('Account is banned');
  }

  await userRepository.touchLastLogin(user.id);
  const tokens = await tokenService.issueTokenPair(user, meta);

  return {
    user: toPublicUser({ ...user, permissions: tokens.permissions }),
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    },
  };
};

const me = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  const permissions = await roleRepository.getPermissionSlugsByRoleId(user.role_id);
  return toPublicUser({ ...user, permissions });
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
  googleLogin,
  me,
  createAndSendOtp,
  checkoutStart,
};
