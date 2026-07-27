const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const accountController = require('../../controllers/account.controller');
const {
  addressBody,
  updateAddressSchema,
  updateProfileSchema,
  placeOrderSchema,
  verifyPaymentSchema,
  cancelOrderSchema,
  returnSchema,
  wishlistSchema,
  cartActivitySchema,
} = require('../../validators/commerce.validator');

const router = express.Router();

router.use(authenticate);

router.get('/summary', accountController.accountSummary);
router.patch('/profile', validate(updateProfileSchema), accountController.updateProfile);

router.get('/addresses', accountController.listAddresses);
router.post('/addresses', validate(addressBody), accountController.createAddress);
router.patch('/addresses/:id', validate(updateAddressSchema), accountController.updateAddress);
router.delete('/addresses/:id', accountController.deleteAddress);

router.get('/wishlist', accountController.listWishlist);
router.post('/wishlist', validate(wishlistSchema), accountController.addWishlist);
router.delete('/wishlist/:catalogKey', accountController.removeWishlist);

router.post('/cart-activity', validate(cartActivitySchema), accountController.reportCartAdd);

router.get('/notifications', accountController.listNotifications);
router.post('/notifications/read-all', accountController.markAllNotificationsRead);
router.post('/notifications/:id/read', accountController.markNotificationRead);

router.get('/orders', accountController.listOrders);
router.post('/orders', validate(placeOrderSchema), accountController.placeOrder);
router.post('/orders/verify-payment', validate(verifyPaymentSchema), accountController.verifyPayment);
router.get('/orders/:id', accountController.getOrder);
router.get('/orders/:id/track', accountController.trackOrder);
router.post('/orders/:id/cancel', validate(cancelOrderSchema), accountController.cancelOrder);
router.post('/orders/:id/return', validate(returnSchema), accountController.requestReturn);

router.get('/returns', accountController.listReturns);

module.exports = router;
