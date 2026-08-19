const config = require('../config');
const ApiError = require('../utils/ApiError');
const { query } = require('../config/database');
const addressRepository = require('../repositories/address.repository');
const orderRepository = require('../repositories/order.repository');
const userRepository = require('../repositories/user.repository');
const notificationRepository = require('../repositories/notification.repository');
const returnRepository = require('../repositories/return.repository');
const razorpayService = require('./razorpay.service');
const shiprocketService = require('./shiprocket.service');
const { calcOrderTotals } = require('./pricing.service');
const { notifyUser } = require('./notification.service');

const calcShipping = (subtotal) => calcOrderTotals(subtotal).shippingAmount;

const STALE_PENDING_MS = 15 * 60 * 1000;

const isOnlinePayment = (order) => {
  const method = String(order?.payment?.method || '').toLowerCase();
  const gateway = String(order?.payment?.gateway || '').toLowerCase();
  return method !== 'cod' && gateway !== 'cod';
};

const fulfillPaidOrder = async (order, { razorpayOrderId, razorpayPaymentId, extraMeta } = {}) => {
  if (order.payment?.id && order.payment.status !== 'paid') {
    await orderRepository.updatePayment(order.payment.id, {
      status: 'paid',
      gatewayPaymentId: razorpayPaymentId || order.payment.gatewayPaymentId || null,
      gatewayOrderId: razorpayOrderId || order.payment.gatewayOrderId || null,
      paidAt: new Date().toISOString(),
      metadata: {
        ...(order.payment.metadata || {}),
        ...(extraMeta || {}),
      },
    });
  }

  if (['pending', 'failed'].includes(order.status)) {
    await orderRepository.updateStatus(order.id, 'confirmed', 'Payment verified via Razorpay');
  }

  let current = await orderRepository.findById(order.id);
  if (!current.shipment) {
    const buyer = await userRepository.findById(current.userId);
    const shipmentData = await shiprocketService.createShipmentForOrder({
      ...current,
      status: 'confirmed',
      payment: { ...current.payment, status: 'paid' },
      userEmail: buyer?.email || current.shippingAddress?.email || null,
    });
    await orderRepository.createShipment({
      orderId: current.id,
      ...shipmentData,
      status: shipmentData.status || 'created',
    });
    if (!shipmentData.mock && current.status !== 'processing') {
      await orderRepository.updateStatus(current.id, 'processing', 'Shipment created with Shiprocket');
    }
    current = await orderRepository.findById(current.id);
  }

  return current;
};

const markPaymentFailed = async (order, reason) => {
  if (order.payment?.id && order.payment.status !== 'paid') {
    await orderRepository.updatePayment(order.payment.id, {
      status: 'failed',
      metadata: {
        ...(order.payment.metadata || {}),
        failReason: reason || 'Payment failed or cancelled',
      },
    });
  }
  if (order.status !== 'failed' && ['pending', 'failed'].includes(order.status)) {
    await orderRepository.updateStatus(order.id, 'failed', reason || 'Payment failed or cancelled');
  }
  return orderRepository.findById(order.id);
};

/** Sync local order from live Razorpay status (paid vs failed). */
const reconcileOrderPayment = async (order, { allowStaleFail = false } = {}) => {
  if (!order?.payment || !isOnlinePayment(order)) return order;
  if (order.payment.status === 'paid' && !['pending', 'failed'].includes(order.status)) {
    return order;
  }
  if (order.payment.status === 'paid' && ['pending', 'failed'].includes(order.status)) {
    return fulfillPaidOrder(order, {
      razorpayOrderId: order.payment.gatewayOrderId,
      razorpayPaymentId: order.payment.gatewayPaymentId,
      extraMeta: { syncedFrom: 'local-paid' },
    });
  }
  if (order.payment.gatewayPaymentId && order.payment.status !== 'paid') {
    return fulfillPaidOrder(order, {
      razorpayOrderId: order.payment.gatewayOrderId,
      razorpayPaymentId: order.payment.gatewayPaymentId,
      extraMeta: { syncedFrom: 'gateway-payment-id' },
    });
  }

  const gatewayOrderId = order.payment.gatewayOrderId;
  if (!gatewayOrderId || !razorpayService.isConfigured()) {
    if (allowStaleFail && isStalePending(order)) {
      return markPaymentFailed(order, 'Payment not completed');
    }
    return order;
  }

  try {
    const info = await razorpayService.inspectOrder(gatewayOrderId);
    if (info.isPaid) {
      const paidOrder = await fulfillPaidOrder(order, {
        razorpayOrderId: gatewayOrderId,
        razorpayPaymentId: info.captured?.id || order.payment.gatewayPaymentId,
        extraMeta: { syncedFrom: 'razorpay', razorpayOrderStatus: info.rzpOrder?.status },
      });
      if (order.payment.status !== 'paid') {
        await notifyUser(paidOrder.userId, {
          title: `Payment received for ${paidOrder.orderNumber}`,
          body: 'Your payment was successful. We are preparing your order.',
          type: 'payment',
          data: { orderId: paidOrder.id, orderNumber: paidOrder.orderNumber },
          orderNumber: paidOrder.orderNumber,
        });
      }
      return paidOrder;
    }
    if (info.failedOnly || (allowStaleFail && isStalePending(order) && !info.isPaid)) {
      return markPaymentFailed(
        order,
        info.failedOnly ? 'Razorpay payment failed' : 'Payment not completed'
      );
    }
  } catch (err) {
    if (allowStaleFail && isStalePending(order)) {
      return markPaymentFailed(order, 'Payment not completed');
    }
  }
  return order;
};

function isStalePending(order) {
  const created = new Date(order.createdAt || order.created_at || 0).getTime();
  return Date.now() - created > STALE_PENDING_MS;
}

const reconcilePendingPayments = async ({ userId, limit = 20 } = {}) => {
  const result = await query(
    `SELECT o.id
     FROM orders o
     JOIN payments p ON p.order_id = o.id
     WHERE p.status = 'pending'
       AND p.method <> 'cod'
       AND o.status IN ('pending', 'failed')
       ${userId ? 'AND o.user_id = $1' : ''}
     ORDER BY o.created_at DESC
     LIMIT ${userId ? '$2' : '$1'}`,
    userId ? [userId, limit] : [limit]
  );
  for (const row of result.rows) {
    const order = await orderRepository.findById(row.id);
    if (order) await reconcileOrderPayment(order, { allowStaleFail: true });
  }
};

const findCatalogProductId = async (idOrSlug) => {
  if (!idOrSlug) return null;
  const found = await query(
    `SELECT id FROM catalog_products
     WHERE id::text = $1 OR slug = $1
     LIMIT 1`,
    [String(idOrSlug)]
  );
  return found.rows[0]?.id || null;
};

/** Legacy commerce `products` table — not the admin `catalog_products` feed. */
const findLegacyProductId = async (idOrSlug) => {
  if (!idOrSlug) return null;
  const found = await query(
    `SELECT id FROM products
     WHERE (id::text = $1 OR slug = $1) AND deleted_at IS NULL
     LIMIT 1`,
    [String(idOrSlug)]
  );
  return found.rows[0]?.id || null;
};

const placeOrder = async (userId, payload) => {
  const {
    items,
    addressId,
    shippingAddress,
    paymentMethod = 'upi',
    notes,
  } = payload;

  if (!items?.length) {
    throw ApiError.badRequest('Cart is empty');
  }

  let addressSnap = shippingAddress || null;
  let shippingAddressId = addressId || null;

  if (addressId) {
    const saved = await addressRepository.findByIdForUser(addressId, userId);
    if (!saved) throw ApiError.badRequest('Invalid shipping address');
    shippingAddressId = saved.id;
    addressSnap = {
      fullName: saved.fullName,
      phone: saved.phone,
      line1: saved.line1,
      line2: saved.line2,
      city: saved.city,
      state: saved.state,
      postalCode: saved.postalCode,
      country: saved.country,
    };
  }

  if (!addressSnap?.fullName || !addressSnap?.line1 || !addressSnap?.postalCode) {
    throw ApiError.badRequest('Shipping address is required');
  }

  const normalizedItems = []
  for (const item of items) {
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.unitPrice ?? item.price);
    if (!item.productName && !item.name) {
      throw ApiError.badRequest('Each item needs a product name');
    }
    if (Number.isNaN(unitPrice) || unitPrice < 0) {
      throw ApiError.badRequest('Invalid item price');
    }
    const meta = item.meta || {};
    let storeId = item.storeId || meta.storeId || null;
    let storeProductId = item.storeProductId || meta.storeProductId || null;
    const looksLikeStore =
      Boolean(storeId || storeProductId || item.channel === 'store' || meta.channel === 'store');

    if (looksLikeStore && (!storeId || !storeProductId)) {
      const idOrSlug = storeProductId || item.productId || item.id || item.catalogKey;
      if (idOrSlug) {
        const found = await query(
          `SELECT id, store_id FROM store_products
           WHERE id::text = $1 OR slug = $1
           LIMIT 1`,
          [String(idOrSlug)]
        );
        if (found.rows[0]) {
          storeProductId = found.rows[0].id;
          storeId = storeId || found.rows[0].store_id;
        }
      }
    }

    const isStoreItem = Boolean(storeId || storeProductId);
    const idOrSlug = item.productId || item.id || item.catalogKey;
    let catalogProductId = null;
    let legacyProductId = null;

    if (!isStoreItem && idOrSlug) {
      catalogProductId = await findCatalogProductId(idOrSlug);
      legacyProductId = await findLegacyProductId(idOrSlug);
    }

    const totalPrice = unitPrice * quantity;
    normalizedItems.push({
      // order_items.product_id FK points at legacy `products`, not catalog_products.
      productId: isStoreItem ? null : legacyProductId,
      variantId: item.variantId || null,
      productName: item.productName || item.name,
      sku: item.sku || String(item.id || item.catalogKey || ''),
      unitPrice,
      quantity,
      totalPrice,
      imageUrl: item.imageUrl || item.image || null,
      meta: {
        ...meta,
        channel: isStoreItem ? 'store' : catalogProductId ? 'catalog' : meta.channel,
        catalogKey: item.catalogKey || (item.id != null ? String(item.id) : null),
        catalogProductId: catalogProductId || meta.catalogProductId || null,
      },
      storeId,
      storeProductId,
      platformFee: 0,
      storeEarning: isStoreItem ? totalPrice : 0,
    });
  }

  const subtotal = normalizedItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const {
    platformFeeAmount,
    shippingAmount,
    taxAmount,
    discountAmount,
    totalAmount,
  } = calcOrderTotals(subtotal);

  const method = paymentMethod === 'cod' ? 'cod' : paymentMethod;
  if (method === 'cod' && !config.commerce.codEnabled) {
    throw ApiError.badRequest('Cash on delivery is not available');
  }

  // Map UI methods to DB enum
  const dbMethod =
    method === 'cod'
      ? 'cod'
      : method === 'card'
        ? 'card'
        : method === 'netbanking'
          ? 'netbanking'
          : method === 'wallet'
            ? 'wallet'
            : 'upi';

  const order = await orderRepository.createWithItems({
    userId,
    items: normalizedItems,
    subtotal,
    taxAmount,
    shippingAmount,
    discountAmount,
    platformFeeAmount,
    totalAmount,
    shippingAddressId,
    billingAddressId: shippingAddressId,
    shippingAddressSnap: addressSnap,
    billingAddressSnap: addressSnap,
    notes,
    paymentMethod: dbMethod,
  });

  await notifyUser(userId, {
    title: `Order ${order.orderNumber} placed`,
    body: 'We received your order and will update you as it progresses.',
    type: 'order',
    data: { orderId: order.id, orderNumber: order.orderNumber },
    orderNumber: order.orderNumber,
    totalLabel: totalAmount != null ? `Total: ₹${Number(totalAmount).toFixed(2)}` : undefined,
  });

  const buyer = await userRepository.findById(userId);
  const userEmail = buyer?.email || addressSnap?.email || null;

  if (dbMethod === 'cod') {
    await orderRepository.updateStatus(order.id, 'confirmed', 'COD order confirmed');
    const shipmentData = await shiprocketService.createShipmentForOrder({
      ...order,
      status: 'confirmed',
      userEmail,
    });
    const shipment = await orderRepository.createShipment({
      orderId: order.id,
      ...shipmentData,
      status: shipmentData.status || 'pending',
    });
    if (!shipmentData.mock) {
      await orderRepository.updateStatus(order.id, 'processing', 'Shipment created with Shiprocket');
    }
    return {
      order: await orderRepository.findByIdForUser(order.id, userId),
      payment: { mode: 'cod', requiresPayment: false },
      shipment,
    };
  }

  if (!razorpayService.isConfigured()) {
    throw ApiError.badRequest(
      'Online payment is not configured. Set Razorpay keys or choose Cash on Delivery.'
    );
  }

  const amountPaise = Math.round(totalAmount * 100);
  const brandName = config.razorpay.displayName || config.appName || 'Uniquworld';
  const rzpOrder = await razorpayService.createOrder({
    amountPaise,
    receipt: order.orderNumber,
    notes: {
      orderId: order.id,
      orderNumber: order.orderNumber,
      brand: brandName,
      store: 'Uniquworld',
    },
  });

  await orderRepository.updatePayment(order.payment.id, {
    gatewayOrderId: rzpOrder.id,
    metadata: { razorpayOrder: rzpOrder, brand: brandName },
  });

  return {
    order: await orderRepository.findByIdForUser(order.id, userId),
    payment: {
      mode: 'razorpay',
      requiresPayment: true,
      keyId: razorpayService.getPublicKey(),
      razorpayOrderId: rzpOrder.id,
      amount: amountPaise,
      currency: rzpOrder.currency,
      // Always Uniquworld on checkout — even when API keys belong to Techackode.
      name: brandName,
      image: config.razorpay.logoUrl || undefined,
      themeColor: config.razorpay.themeColor,
      description: `Uniquworld · Order ${order.orderNumber}`,
    },
  };
};

const verifyRazorpayPayment = async (userId, payload) => {
  const {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = payload;

  const order = await orderRepository.findByIdForUser(orderId, userId);
  if (!order) throw ApiError.notFound('Order not found');

  const valid = razorpayService.verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
  if (!valid) {
    const synced = await reconcileOrderPayment(order, { allowStaleFail: false });
    if (synced.payment?.status === 'paid') return synced;
    await failRazorpayPayment(userId, {
      orderId,
      reason: 'Invalid payment signature',
    });
    throw ApiError.badRequest('Invalid payment signature');
  }

  const paid = await fulfillPaidOrder(order, {
    razorpayOrderId,
    razorpayPaymentId,
    extraMeta: { razorpayPaymentId, razorpaySignature },
  });

  if (order.payment?.status !== 'paid') {
    await notifyUser(userId, {
      title: `Payment received for ${paid.orderNumber}`,
      body: 'Your payment was successful. We are preparing your order.',
      type: 'payment',
      data: { orderId: paid.id, orderNumber: paid.orderNumber },
      orderNumber: paid.orderNumber,
    });
  }

  return orderRepository.findByIdForUser(paid.id, userId);
};

const failRazorpayPayment = async (userId, { orderId, reason } = {}) => {
  const order = await orderRepository.findByIdForUser(orderId, userId);
  if (!order) throw ApiError.notFound('Order not found');
  if (order.payment?.status === 'paid' && !['pending'].includes(order.status)) {
    return order;
  }

  const synced = await reconcileOrderPayment(order, { allowStaleFail: false });
  if (synced.payment?.status === 'paid') return synced;

  if (!['pending', 'failed'].includes(synced.status) && synced.payment?.status === 'paid') {
    return synced;
  }
  if (!['pending', 'failed'].includes(synced.status)) {
    return synced;
  }

  return markPaymentFailed(synced, reason || 'Payment failed or cancelled');
};

const listOrders = async (userId, query) => {
  await reconcilePendingPayments({ userId, limit: 20 });
  return orderRepository.listByUser(userId, query);
};

const getOrder = async (userId, id) => {
  let order = await orderRepository.findByIdForUser(id, userId);
  if (!order) throw ApiError.notFound('Order not found');
  order = await reconcileOrderPayment(order, { allowStaleFail: true });
  return orderRepository.findByIdForUser(order.id, userId);
};

const getOrderByNumber = async (userId, orderNumber) => {
  const order = await orderRepository.findByOrderNumber(orderNumber, userId);
  if (!order) throw ApiError.notFound('Order not found');
  return order;
};

const cancelOrder = async (userId, id, reason) => {
  const order = await orderRepository.findByIdForUser(id, userId);
  if (!order) throw ApiError.notFound('Order not found');
  if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
    throw ApiError.badRequest('This order can no longer be cancelled');
  }
  await orderRepository.updateStatus(id, 'cancelled', reason || 'Cancelled by customer', userId);
  await notifyUser(userId, {
    title: `Order ${order.orderNumber} cancelled`,
    body: reason || 'Your order was cancelled.',
    type: 'order',
    data: { orderId: order.id },
    orderNumber: order.orderNumber,
  });
  return orderRepository.findByIdForUser(id, userId);
};

const requestReturn = async (userId, orderId, { reason, notes }) => {
  const order = await orderRepository.findByIdForUser(orderId, userId);
  if (!order) throw ApiError.notFound('Order not found');
  if (!['delivered'].includes(order.status)) {
    throw ApiError.badRequest('Returns are only available for delivered orders');
  }
  const existing = await returnRepository.findByOrderForUser(orderId, userId);
  if (existing && !['rejected', 'closed'].includes(existing.status)) {
    throw ApiError.conflict('A return request already exists for this order');
  }
  const ret = await returnRepository.create({
    userId,
    orderId,
    reason,
    notes,
    refundAmount: order.totalAmount,
  });
  await notifyUser(userId, {
    title: `Return requested for ${order.orderNumber}`,
    body: 'We will review your return request shortly.',
    type: 'order',
    data: { orderId, returnId: ret.id },
    orderNumber: order.orderNumber,
  });
  return ret;
};

const trackOrder = async (userId, orderId) => {
  const order = await orderRepository.findByIdForUser(orderId, userId);
  if (!order) throw ApiError.notFound('Order not found');

  let liveTracking = null;
  if (order.shipment?.awbCode && shiprocketService.isConfigured()) {
    try {
      liveTracking = await shiprocketService.trackByAwb(order.shipment.awbCode);
    } catch {
      liveTracking = null;
    }
  }

  return {
    order,
    tracking: liveTracking,
  };
};

const accountSummary = async (userId) => {
  const [orders, addresses, wishlistCount, unread] = await Promise.all([
    orderRepository.countByUser(userId),
    addressRepository.listByUser(userId),
    require('../repositories/wishlist.repository').countByUser(userId),
    notificationRepository.unreadCount(userId),
  ]);
  return {
    ordersCount: orders,
    addressesCount: addresses.length,
    wishlistCount,
    unreadNotifications: unread,
  };
};

module.exports = {
  placeOrder,
  verifyRazorpayPayment,
  failRazorpayPayment,
  listOrders,
  getOrder,
  getOrderByNumber,
  cancelOrder,
  requestReturn,
  trackOrder,
  accountSummary,
  calcShipping,
  reconcileOrderPayment,
  reconcilePendingPayments,
  fulfillPaidOrder,
};
