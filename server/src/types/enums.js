const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  CORPORATE: 'corporate',
});

const USER_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
  PENDING: 'pending',
});

const OTP_PURPOSE = Object.freeze({
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
  LOGIN: 'login',
  PHONE_VERIFICATION: 'phone_verification',
});

const ROLE_IDS = Object.freeze({
  SUPER_ADMIN: '11111111-1111-1111-1111-111111111001',
  ADMIN: '11111111-1111-1111-1111-111111111002',
  CUSTOMER: '11111111-1111-1111-1111-111111111003',
  CORPORATE: '11111111-1111-1111-1111-111111111004',
});

module.exports = {
  ROLES,
  USER_STATUS,
  OTP_PURPOSE,
  ROLE_IDS,
};
