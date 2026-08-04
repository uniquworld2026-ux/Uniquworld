const express = require('express');
const config = require('../../config');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/rbac.middleware');
const { authLimiter } = require('../../middlewares/rateLimiter.middleware');
const { ROLES } = require('../../types/enums');
const storePartnerController = require('../../controllers/storePartner.controller');
const {
  partnerRegisterSchema,
  adminCreatePartnerSchema,
  storeProductSchema,
  updateStoreProfileSchema,
  withdrawSchema,
  withdrawalStatusSchema,
} = require('../../validators/storePartner.validator');

const router = express.Router();

const requireAdminAccess = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (config.adminApiKey && key && key === config.adminApiKey) {
    req.adminAccess = 'api-key';
    return next();
  }
  return authenticate(req, res, (err) => {
    if (err) return next(err);
    return requireRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN)(req, res, next);
  });
};

/** Public partner self-registration */
router.post(
  '/register',
  authLimiter,
  validate(partnerRegisterSchema),
  storePartnerController.register
);

/** Store owner portal (JWT + store_owner role) */
router.get(
  '/me/dashboard',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  storePartnerController.dashboard
);
router.patch(
  '/me/profile',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  validate(updateStoreProfileSchema),
  storePartnerController.updateProfile
);
router.get(
  '/me/products',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  storePartnerController.listProducts
);
router.post(
  '/me/products',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  validate(storeProductSchema),
  storePartnerController.createProduct
);
router.patch(
  '/me/products/:id',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  validate(storeProductSchema.partial()),
  storePartnerController.updateProduct
);
router.delete(
  '/me/products/:id',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  storePartnerController.removeProduct
);
router.patch(
  '/me/products/:id/stock',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  storePartnerController.patchInventory
);
router.get(
  '/me/sales',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  storePartnerController.listSales
);
router.get(
  '/me/earnings',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  storePartnerController.earnings
);
router.post(
  '/me/withdrawals',
  authenticate,
  requireRoles(ROLES.STORE_OWNER),
  validate(withdrawSchema),
  storePartnerController.withdraw
);

/** Admin partner management */
router.post(
  '/admin/partners',
  requireAdminAccess,
  validate(adminCreatePartnerSchema),
  storePartnerController.adminCreate
);
router.get('/admin/stores', requireAdminAccess, storePartnerController.adminListStores);
router.get('/admin/stores/:id', requireAdminAccess, storePartnerController.adminGetStore);
router.get('/admin/withdrawals', requireAdminAccess, storePartnerController.adminListWithdrawals);
router.patch(
  '/admin/withdrawals/:id',
  requireAdminAccess,
  validate(withdrawalStatusSchema),
  storePartnerController.adminUpdateWithdrawal
);

module.exports = router;
