const express = require('express');
const config = require('../../config');
const ApiError = require('../../utils/ApiError');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/rbac.middleware');
const { ROLES } = require('../../types/enums');
const erpController = require('../../controllers/erp.controller');

const router = express.Router();

/**
 * Allow admin panel access via JWT (admin roles) or shared admin API key.
 */
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

router.get('/modules', requireAdminAccess, erpController.listModules);

router.get('/commerce/orders', requireAdminAccess, erpController.listOrders);
router.patch('/commerce/orders/:id', requireAdminAccess, erpController.updateOrderStatus);
router.get('/commerce/payments', requireAdminAccess, erpController.listPayments);
router.get('/commerce/shipments', requireAdminAccess, erpController.listShipments);
router.patch('/commerce/shipments/:id', requireAdminAccess, erpController.updateShipment);
router.get('/commerce/customers', requireAdminAccess, erpController.listCustomers);

router.get('/:module', requireAdminAccess, erpController.list);
router.get('/:module/:id', requireAdminAccess, erpController.getOne);
router.post('/:module', requireAdminAccess, erpController.create);
router.patch('/:module/:id', requireAdminAccess, erpController.update);
router.delete('/:module/:id', requireAdminAccess, erpController.remove);

module.exports = router;
