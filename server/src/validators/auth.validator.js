const { z } = require('zod');
const { OTP_PURPOSE, ROLES } = require('../types/enums');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128)
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

const registerSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.toLowerCase()),
  password: passwordSchema,
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().max(100).trim().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  role: z.enum([ROLES.CUSTOMER, ROLES.CORPORATE]).optional().default(ROLES.CUSTOMER),
});

const loginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(10),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
});

const resetPasswordSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  code: z.string().min(4).max(10),
  newPassword: passwordSchema,
});

const verifyOtpSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  code: z.string().min(4).max(10),
  purpose: z.enum([
    OTP_PURPOSE.EMAIL_VERIFICATION,
    OTP_PURPOSE.PASSWORD_RESET,
    OTP_PURPOSE.LOGIN,
    OTP_PURPOSE.PHONE_VERIFICATION,
  ]),
});

const resendOtpSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  purpose: z.enum([
    OTP_PURPOSE.EMAIL_VERIFICATION,
    OTP_PURPOSE.PASSWORD_RESET,
    OTP_PURPOSE.LOGIN,
    OTP_PURPOSE.PHONE_VERIFICATION,
  ]),
});

const googleLoginSchema = z
  .object({
    googleId: z.string().min(1).optional(),
    email: z.string().email().transform((v) => v.toLowerCase()).optional(),
    firstName: z.string().min(1).max(100).optional(),
    lastName: z.string().max(100).optional().nullable(),
    avatarUrl: z.string().url().optional().nullable(),
    /** Supabase Auth access token — verified via SUPABASE_JWKS_URL */
    idToken: z.string().min(20).optional(),
  })
  .refine((data) => Boolean(data.idToken) || (data.googleId && data.email), {
    message: 'Provide idToken (Supabase JWT) or googleId + email',
  });

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyOtpSchema,
  resendOtpSchema,
  googleLoginSchema,
};
