const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { hashPassword } = require('../utils/password');
const { toPublicUser } = require('../models/user.model');
const { USER_STATUS, OTP_PURPOSE, ROLES } = require('../types/enums');

const userRepository = require('../repositories/user.repository');
const roleRepository = require('../repositories/role.repository');
const storePartnerRepository = require('../repositories/storePartner.repository');
const emailService = require('./email.service');
const authService = require('./auth.service');

const registerPartner = async (payload) => {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    throw ApiError.conflict('Email is already registered');
  }

  const passwordHash = await hashPassword(payload.password);
  const roleId = await roleRepository.resolveRoleId(ROLES.STORE_OWNER);

  const user = await userRepository.create({
    email: payload.email,
    passwordHash,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    roleId,
    status: USER_STATUS.PENDING,
  });

  const store = await storePartnerRepository.createStore({
    name: payload.storeName,
    code: payload.storeCode || undefined,
    type: 'partner',
    city: payload.city,
    state: payload.state,
    address: payload.address,
    managerName: `${payload.firstName}${payload.lastName ? ` ${payload.lastName}` : ''}`.trim(),
    phone: payload.phone,
    email: payload.email,
    gstin: payload.gstin,
    description: payload.description,
    ownerUserId: user.id,
    bankAccountName: payload.bankAccountName,
    bankAccountNumber: payload.bankAccountNumber,
    bankIfsc: payload.bankIfsc,
    bankName: payload.bankName,
    status: 'pending_verification',
  });

  const withRole = await userRepository.findById(user.id);
  const otpMeta = await authService.createAndSendOtp({
    userId: user.id,
    email: user.email,
    purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
    firstName: user.first_name,
  });

  try {
    await emailService.sendStorePartnerWelcomeEmail({
      to: user.email,
      firstName: user.first_name,
      storeName: store.name,
    });
  } catch (err) {
    logger.warn('Store partner welcome email skipped', { email: user.email, message: err.message });
  }

  return {
    user: toPublicUser(withRole),
    store,
    otp: {
      purpose: OTP_PURPOSE.EMAIL_VERIFICATION,
      ...otpMeta,
    },
    message:
      'Registration successful. Verify your email OTP to unlock your store dashboard and start uploading products.',
  };
};

/**
 * Called after email OTP verification succeeds for a store_owner.
 */
const activateStoreAfterEmailVerify = async (userId) => {
  const store = await storePartnerRepository.findByOwnerUserId(userId);
  if (!store) return null;
  if (store.emailVerifiedAt && store.status === 'active') return store;

  return storePartnerRepository.updateStore(store.id, {
    emailVerifiedAt: new Date().toISOString(),
    status: 'active',
    approvedAt: store.approvedAt || new Date().toISOString(),
  });
};

const adminCreatePartner = async (payload, adminUserId) => {
  const existing = await userRepository.findByEmail(payload.email);
  if (existing) {
    throw ApiError.conflict('Email is already registered');
  }

  const tempPassword =
    payload.password ||
    `Uw${Math.random().toString(36).slice(2, 8)}!${Math.floor(10 + Math.random() * 89)}`;
  const passwordHash = await hashPassword(tempPassword);
  const roleId = await roleRepository.resolveRoleId(ROLES.STORE_OWNER);

  const status = payload.status === 'active' ? USER_STATUS.ACTIVE : USER_STATUS.PENDING;
  const user = await userRepository.create({
    email: payload.email,
    passwordHash,
    firstName: payload.firstName,
    lastName: payload.lastName,
    phone: payload.phone,
    roleId,
    status,
  });

  if (status === USER_STATUS.ACTIVE) {
    await userRepository.updateById(user.id, {
      emailVerifiedAt: new Date().toISOString(),
    });
  }

  const storeStatus = payload.status || 'active';
  const store = await storePartnerRepository.createStore({
    name: payload.storeName,
    code: payload.storeCode || undefined,
    type: 'partner',
    city: payload.city,
    state: payload.state,
    address: payload.address,
    managerName: `${payload.firstName}${payload.lastName ? ` ${payload.lastName}` : ''}`.trim(),
    phone: payload.phone,
    email: payload.email,
    gstin: payload.gstin,
    description: payload.description,
    ownerUserId: user.id,
    bankAccountName: payload.bankAccountName,
    bankAccountNumber: payload.bankAccountNumber,
    bankIfsc: payload.bankIfsc,
    bankName: payload.bankName,
    status: storeStatus,
    emailVerifiedAt: storeStatus === 'active' ? new Date().toISOString() : null,
    approvedAt: storeStatus === 'active' ? new Date().toISOString() : null,
  });

  if (adminUserId && storeStatus === 'active') {
    await storePartnerRepository.updateStore(store.id, { approvedBy: adminUserId });
  }

  if (payload.sendInvite !== false) {
    try {
      await emailService.sendStorePartnerInviteEmail({
        to: payload.email,
        firstName: payload.firstName,
        storeName: store.name,
        tempPassword: payload.password ? null : tempPassword,
        loginUrl: `${config.clientUrl}/store/partner/login`,
      });
    } catch (err) {
      logger.warn('Store partner invite email failed', { email: payload.email, message: err.message });
    }
  }

  const withRole = await userRepository.findById(user.id);
  return {
    user: toPublicUser(withRole),
    store,
    temporaryPassword: payload.password ? undefined : tempPassword,
  };
};

const requireOwnerStore = async (userId) => {
  const store = await storePartnerRepository.findByOwnerUserId(userId);
  if (!store) throw ApiError.notFound('No store linked to this account');
  if (store.status === 'inactive') {
    throw ApiError.forbidden('Store is inactive. Contact support.');
  }
  if (store.status === 'pending_verification') {
    throw ApiError.forbidden('Verify your email to access the store dashboard.');
  }
  return store;
};

const getDashboard = async (userId) => {
  const store = await requireOwnerStore(userId);
  const [balance, monthly, products, sales] = await Promise.all([
    storePartnerRepository.getBalance(store.id),
    storePartnerRepository.listMonthlyEarnings(store.id),
    storePartnerRepository.listProductsByStore(store.id),
    storePartnerRepository.listSales(store.id, { limit: 10 }),
  ]);
  return {
    store,
    balance,
    monthlyEarnings: monthly,
    productCount: products.length,
    publishedCount: products.filter((p) => p.status === 'published').length,
    recentSales: sales,
    feeInfo: {
      platformFeePercent: config.commerce.storePlatformFeePercent,
      shippingAmount: config.commerce.defaultShippingAmount,
      note:
        'Customer pays product + ₹5 platform fee + shipping. You receive the full product amount after delivery.',
    },
  };
};

const listOwnerProducts = async (userId) => {
  const store = await requireOwnerStore(userId);
  const items = await storePartnerRepository.listProductsByStore(store.id);
  return { store, items };
};

const createOwnerProduct = async (userId, payload) => {
  const store = await requireOwnerStore(userId);
  if (store.status !== 'active') {
    throw ApiError.forbidden('Store must be active to publish products');
  }
  const item = await storePartnerRepository.createProduct(store.id, payload);
  return { item };
};

const updateOwnerProduct = async (userId, productId, payload) => {
  const store = await requireOwnerStore(userId);
  const existing = await storePartnerRepository.findProductByIdForStore(productId, store.id);
  if (!existing) throw ApiError.notFound('Product not found');
  const item = await storePartnerRepository.updateProduct(productId, store.id, payload);
  return { item };
};

const deleteOwnerProduct = async (userId, productId) => {
  const store = await requireOwnerStore(userId);
  const ok = await storePartnerRepository.deleteProduct(productId, store.id);
  if (!ok) throw ApiError.notFound('Product not found');
  return { deleted: true };
};

const updateInventory = async (userId, productId, stock) => {
  const store = await requireOwnerStore(userId);
  const existing = await storePartnerRepository.findProductByIdForStore(productId, store.id);
  if (!existing) throw ApiError.notFound('Product not found');
  const item = await storePartnerRepository.updateProduct(productId, store.id, {
    stock: Number(stock),
  });
  return { item };
};

const listOwnerSales = async (userId) => {
  const store = await requireOwnerStore(userId);
  const items = await storePartnerRepository.listSales(store.id);
  return { store, items };
};

const getOwnerEarnings = async (userId) => {
  const store = await requireOwnerStore(userId);
  const [balance, monthly, earnings, withdrawals] = await Promise.all([
    storePartnerRepository.getBalance(store.id),
    storePartnerRepository.listMonthlyEarnings(store.id),
    storePartnerRepository.listEarnings(store.id),
    storePartnerRepository.listWithdrawals(store.id),
  ]);
  return { store, balance, monthlyEarnings: monthly, earnings, withdrawals };
};

const requestWithdrawal = async (userId, { amount, note }) => {
  const store = await requireOwnerStore(userId);
  if (!store.bankAccountNumber || !store.bankIfsc) {
    throw ApiError.badRequest('Add bank account details before requesting a withdrawal');
  }
  try {
    const withdrawal = await storePartnerRepository.createWithdrawal({
      storeId: store.id,
      amount: Number(amount),
      bank: {
        bankAccountName: store.bankAccountName,
        bankAccountNumber: store.bankAccountNumber,
        bankIfsc: store.bankIfsc,
        bankName: store.bankName,
      },
      note,
      requestedBy: userId,
    });
    return { withdrawal };
  } catch (err) {
    if (err.statusCode === 400) throw ApiError.badRequest(err.message);
    throw err;
  }
};

const updateOwnerProfile = async (userId, payload) => {
  const store = await requireOwnerStore(userId);
  const updated = await storePartnerRepository.updateStore(store.id, payload);
  return { store: updated };
};

module.exports = {
  registerPartner,
  activateStoreAfterEmailVerify,
  adminCreatePartner,
  requireOwnerStore,
  getDashboard,
  listOwnerProducts,
  createOwnerProduct,
  updateOwnerProduct,
  deleteOwnerProduct,
  updateInventory,
  listOwnerSales,
  getOwnerEarnings,
  requestWithdrawal,
  updateOwnerProfile,
};
