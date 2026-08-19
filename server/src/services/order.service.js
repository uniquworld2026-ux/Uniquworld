const config = require('../config');
const ApiError = require('../utils/ApiError');
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
      const { query } = require('../config/database');
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

    const totalPrice = unitPrice * quantity;
    const isStoreItem = Boolean(storeId || storeProductId);
    normalizedItems.push({
      productId: item.productId || null,
      variantId: item.variantId || null,
      productName: item.productName || item.name,
      sku: item.sku || String(item.id || item.catalogKey || ''),
      unitPrice,
      quantity,
      totalPrice,
      imageUrl: item.imageUrl || item.image || null,
      meta: { ...meta, channel: isStoreItem ? 'store' : meta.channel },
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
  if (!valid) throw ApiError.badRequest('Invalid payment signature');

  await orderRepository.updatePayment(order.payment.id, {
    status: 'paid',
    gatewayPaymentId: razorpayPaymentId,
    gatewayOrderId: razorpayOrderId,
    paidAt: new Date().toISOString(),
    metadata: {
      ...(order.payment.metadata || {}),
      razorpayPaymentId,
      razorpaySignature,
    },
  });

  await orderRepository.updateStatus(order.id, 'confirmed', 'Payment verified via Razorpay');

  const buyer = await userRepository.findById(userId);
  const shipmentData = await shiprocketService.createShipmentForOrder({
    ...order,
    status: 'confirmed',
    payment: { ...order.payment, status: 'paid' },
    userEmail: buyer?.email || order.shippingAddress?.email || null,
  });
  await orderRepository.createShipment({
    orderId: order.id,
    ...shipmentData,
    status: shipmentData.status || 'created',
  });

  if (!shipmentData.mock) {
    await orderRepository.updateStatus(order.id, 'processing', 'Shipment created with Shiprocket');
  }

  await notifyUser(userId, {
    title: `Payment received for ${order.orderNumber}`,
    body: 'Your payment was successful. We are preparing your order.',
    type: 'payment',
    data: { orderId: order.id, orderNumber: order.orderNumber },
    orderNumber: order.orderNumber,
  });

  return orderRepository.findByIdForUser(order.id, userId);
};

const listOrders = async (userId, query) => orderRepository.listByUser(userId, query);

const getOrder = async (userId, id) => {
  const order = await orderRepository.findByIdForUser(id, userId);
  if (!order) throw ApiError.notFound('Order not found');
  return order;
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
  listOrders,
  getOrder,
  getOrderByNumber,
  cancelOrder,
  requestReturn,
  trackOrder,
  accountSummary,
  calcShipping,
};
