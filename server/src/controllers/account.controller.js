const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/user.repository');
const addressRepository = require('../repositories/address.repository');
const wishlistRepository = require('../repositories/wishlist.repository');
const notificationRepository = require('../repositories/notification.repository');
const orderService = require('../services/order.service');
const notificationService = require('../services/notification.service');
const { toPublicUser } = require('../models/user.model');

const updateProfile = asyncHandler(async (req, res) => {
  const updated = await userRepository.updateById(req.user.id, req.body);
  if (!updated) throw ApiError.notFound('User not found');
  const withRole = await userRepository.findByIdWithRole(req.user.id);
  return ApiResponse.ok(res, { user: toPublicUser(withRole) }, 'Profile updated');
});

const accountSummary = asyncHandler(async (req, res) => {
  const data = await orderService.accountSummary(req.user.id);
  return ApiResponse.ok(res, data);
});

const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressRepository.listByUser(req.user.id);
  return ApiResponse.ok(res, { addresses });
});

const createAddress = asyncHandler(async (req, res) => {
  const address = await addressRepository.create(req.user.id, req.body);
  return ApiResponse.created(res, { address }, 'Address saved');
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await addressRepository.update(req.params.id, req.user.id, req.body);
  if (!address) throw ApiError.notFound('Address not found');
  return ApiResponse.ok(res, { address }, 'Address updated');
});

const deleteAddress = asyncHandler(async (req, res) => {
  const ok = await addressRepository.remove(req.params.id, req.user.id);
  if (!ok) throw ApiError.notFound('Address not found');
  return ApiResponse.ok(res, null, 'Address deleted');
});

const listWishlist = asyncHandler(async (req, res) => {
  const items = await wishlistRepository.listByUser(req.user.id);
  return ApiResponse.ok(res, { items });
});

const addWishlist = asyncHandler(async (req, res) => {
  const item = await wishlistRepository.add(req.user.id, {
    catalogKey: req.body.catalogKey,
    productId: req.body.productId || null,
    productSnapshot: req.body.product,
  });

  const productName = req.body.product?.name || 'Gift';
  const productImage = req.body.product?.image || req.body.product?.imageUrl || null;
  await notificationService.notifyProductActivity(req.user.id, {
    action: 'wishlist',
    productName,
    productId: req.body.productId || null,
    catalogKey: req.body.catalogKey,
    productImage,
  });

  return ApiResponse.created(res, { item }, 'Added to wishlist');
});

/**
 * Signed-in customer added a product to bag — in-app + email notification.
 */
const reportCartAdd = asyncHandler(async (req, res) => {
  const productName = String(req.body.productName || '').trim();
  if (!productName) throw ApiError.badRequest('productName is required');

  await notificationService.notifyProductActivity(req.user.id, {
    action: 'cart',
    productName,
    productId: req.body.productId || null,
    catalogKey: req.body.catalogKey || null,
    productImage: req.body.productImage || null,
    quantity: req.body.quantity || 1,
  });

  return ApiResponse.ok(res, { notified: true }, 'Notification sent');
});

const removeWishlist = asyncHandler(async (req, res) => {
  const ok = await wishlistRepository.removeByKey(req.user.id, req.params.catalogKey);
  if (!ok) throw ApiError.notFound('Wishlist item not found');
  return ApiResponse.ok(res, null, 'Removed from wishlist');
});

const listNotifications = asyncHandler(async (req, res) => {
  const [items, unreadCount] = await Promise.all([
    notificationRepository.listByUser(req.user.id),
    notificationRepository.unreadCount(req.user.id),
  ]);
  return ApiResponse.ok(res, { items, unreadCount });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const item = await notificationRepository.markRead(req.params.id, req.user.id);
  if (!item) throw ApiError.notFound('Notification not found');
  return ApiResponse.ok(res, { item });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await notificationRepository.markAllRead(req.user.id);
  return ApiResponse.ok(res, null, 'All notifications marked as read');
});

const placeOrder = asyncHandler(async (req, res) => {
  const data = await orderService.placeOrder(req.user.id, req.body);
  return ApiResponse.created(res, data, 'Order created');
});

const verifyPayment = asyncHandler(async (req, res) => {
  const order = await orderService.verifyRazorpayPayment(req.user.id, req.body);
  return ApiResponse.ok(res, { order }, 'Payment verified');
});

const listOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listOrders(req.user.id, {
    status: req.query.status,
    limit: Number(req.query.limit) || 20,
    offset: Number(req.query.offset) || 0,
  });
  return ApiResponse.ok(res, { orders });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.user.id, req.params.id);
  return ApiResponse.ok(res, { order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.user.id, req.params.id, req.body.reason);
  return ApiResponse.ok(res, { order }, 'Order cancelled');
});

const requestReturn = asyncHandler(async (req, res) => {
  const ret = await orderService.requestReturn(req.user.id, req.params.id, req.body);
  return ApiResponse.created(res, { returnRequest: ret }, 'Return requested');
});

const trackOrder = asyncHandler(async (req, res) => {
  const data = await orderService.trackOrder(req.user.id, req.params.id);
  return ApiResponse.ok(res, data);
});

const listReturns = asyncHandler(async (req, res) => {
  const returnRepository = require('../repositories/return.repository');
  const items = await returnRepository.listByUser(req.user.id);
  return ApiResponse.ok(res, { items });
});

module.exports = {
  updateProfile,
  accountSummary,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  listWishlist,
  addWishlist,
  removeWishlist,
  reportCartAdd,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  placeOrder,
  verifyPayment,
  listOrders,
  getOrder,
  cancelOrder,
  requestReturn,
  trackOrder,
  listReturns,
};
