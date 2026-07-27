const logger = require('../utils/logger');
const notificationRepository = require('../repositories/notification.repository');
const userRepository = require('../repositories/user.repository');
const emailService = require('./email.service');

/**
 * In-app notification + optional email. Never throws to the caller.
 */
const notifyUser = async (
  userId,
  { title, body, type = 'system', data = {}, orderNumber, totalLabel, productName, productImage, ctaLabel, ctaUrl }
) => {
  try {
    await notificationRepository.create({ userId, title, body, type, data });
  } catch (err) {
    logger.warn('Failed to create in-app notification', { message: err.message, userId });
  }

  try {
    const user = await userRepository.findById(userId);
    if (!user?.email) return;

    if (orderNumber) {
      await emailService.sendOrderEmail({
        to: user.email,
        firstName: user.first_name,
        orderNumber,
        title,
        message: body,
        totalLabel,
      });
      return;
    }

    if (productName) {
      await emailService.sendProductActivityEmail({
        to: user.email,
        firstName: user.first_name,
        title,
        body,
        productName,
        productImage,
        ctaLabel,
        ctaUrl,
      });
      return;
    }

    await emailService.sendNotificationEmail({
      to: user.email,
      firstName: user.first_name,
      title,
      body,
    });
  } catch (err) {
    logger.warn('Notification email failed', { message: err.message, userId });
  }
};

/**
 * Customer added a product to bag or wishlist.
 */
const notifyProductActivity = async (userId, { action, productName, productId, catalogKey, productImage, quantity }) => {
  const name = String(productName || 'a gift').trim() || 'a gift';
  const isWishlist = action === 'wishlist';
  const title = isWishlist ? 'Saved to your wishlist' : 'Added to your bag';
  const qty = Number(quantity) > 1 ? Number(quantity) : 1;
  const body = isWishlist
    ? `“${name}” was saved to your wishlist. Open Uniquworld anytime to move it to your bag.`
    : qty > 1
      ? `“${name}” (×${qty}) was added to your bag. Complete checkout when you’re ready.`
      : `“${name}” was added to your bag. Complete checkout when you’re ready.`;

  await notifyUser(userId, {
    title,
    body,
    type: 'promo',
    data: {
      action: isWishlist ? 'wishlist_add' : 'cart_add',
      productId: productId || null,
      catalogKey: catalogKey || null,
      productName: name,
      quantity: qty,
    },
    productName: name,
    productImage: productImage || null,
    ctaLabel: isWishlist ? 'View wishlist' : 'View bag',
    ctaUrl: isWishlist ? '/wishlist' : '/cart',
  });
};

module.exports = {
  notifyUser,
  notifyProductActivity,
};
