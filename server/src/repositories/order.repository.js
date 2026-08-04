const { query, getClient } = require('../config/database');

const toOrderItem = (row) => ({
  id: row.id,
  productId: row.product_id,
  variantId: row.variant_id,
  productName: row.product_name,
  sku: row.sku,
  unitPrice: Number(row.unit_price),
  quantity: row.quantity,
  totalPrice: Number(row.total_price),
  imageUrl: row.image_url,
  meta: row.meta || {},
});

const toPayment = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    method: row.method,
    status: row.status,
    amount: Number(row.amount),
    currency: row.currency,
    gateway: row.gateway,
    gatewayPaymentId: row.gateway_payment_id,
    gatewayOrderId: row.gateway_order_id,
    paidAt: row.paid_at,
    metadata: row.metadata || {},
    createdAt: row.created_at,
  };
};

const toShipment = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    carrier: row.carrier,
    status: row.shipment_status,
    awbCode: row.awb_code,
    courierName: row.courier_name,
    trackingUrl: row.tracking_url,
    shiprocketOrderId: row.shiprocket_order_id,
    shiprocketShipmentId: row.shiprocket_shipment_id,
    labelUrl: row.label_url,
    estimatedDelivery: row.estimated_delivery,
    metadata: row.metadata || {},
    shippedAt: row.shipped_at,
    deliveredAt: row.delivered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const toOrder = (row, extras = {}) => {
  if (!row) return null;
  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    status: row.status,
    subtotal: Number(row.subtotal),
    taxAmount: Number(row.tax_amount),
    shippingAmount: Number(row.shipping_amount),
    discountAmount: Number(row.discount_amount),
    platformFeeAmount: Number(row.platform_fee_amount || 0),
    totalAmount: Number(row.total_amount),
    shippingAddressId: row.shipping_address_id,
    billingAddressId: row.billing_address_id,
    shippingAddress: row.shipping_address_snap,
    billingAddress: row.billing_address_snap,
    notes: row.notes,
    cancelledAt: row.cancelled_at,
    deliveredAt: row.delivered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...extras,
  };
};

const generateOrderNumber = () => {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `UW${y}${m}${d}${rand}`;
};

const createWithItems = async ({
  userId,
  items,
  subtotal,
  taxAmount = 0,
  shippingAmount = 0,
  discountAmount = 0,
  platformFeeAmount = 0,
  totalAmount,
  shippingAddressId,
  billingAddressId,
  shippingAddressSnap,
  billingAddressSnap,
  notes,
  paymentMethod,
}) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const orderNumber = generateOrderNumber();

    const orderResult = await client.query(
      `INSERT INTO orders (
         order_number, user_id, status, subtotal, tax_amount, shipping_amount,
         discount_amount, platform_fee_amount, total_amount, shipping_address_id, billing_address_id,
         shipping_address_snap, billing_address_snap, notes
       ) VALUES ($1,$2,'pending',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        orderNumber,
        userId,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        platformFeeAmount,
        totalAmount,
        shippingAddressId || null,
        billingAddressId || null,
        JSON.stringify(shippingAddressSnap || null),
        JSON.stringify(billingAddressSnap || null),
        notes || null,
      ]
    );
    const order = orderResult.rows[0];

    const createdItems = [];
    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO order_items (
           order_id, product_id, variant_id, product_name, sku,
           unit_price, quantity, total_price, image_url, meta,
           store_id, store_product_id, platform_fee, store_earning
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING *`,
        [
          order.id,
          item.productId || null,
          item.variantId || null,
          item.productName,
          item.sku || null,
          item.unitPrice,
          item.quantity,
          item.totalPrice,
          item.imageUrl || null,
          JSON.stringify(item.meta || {}),
          item.storeId || null,
          item.storeProductId || null,
          item.platformFee || 0,
          item.storeEarning || 0,
        ]
      );
      createdItems.push(toOrderItem(itemResult.rows[0]));
    }

    const paymentResult = await client.query(
      `INSERT INTO payments (order_id, method, status, amount, currency, gateway)
       VALUES ($1, $2, 'pending', $3, 'INR', $4)
       RETURNING *`,
      [
        order.id,
        paymentMethod,
        totalAmount,
        paymentMethod === 'cod' ? 'cod' : 'razorpay',
      ]
    );

    await client.query(
      `INSERT INTO order_status_events (order_id, status, note)
       VALUES ($1, 'pending', 'Order placed')`,
      [order.id]
    );

    await client.query('COMMIT');
    return toOrder(order, {
      items: createdItems,
      payment: toPayment(paymentResult.rows[0]),
      timeline: [{ status: 'pending', note: 'Order placed', createdAt: order.created_at }],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const listByUser = async (userId, { limit = 20, offset = 0, status } = {}) => {
  const params = [userId, limit, offset];
  let statusFilter = '';
  if (status) {
    params.push(status);
    statusFilter = `AND o.status = $${params.length}`;
  }

  const result = await query(
    `SELECT o.* FROM orders o
     WHERE o.user_id = $1 ${statusFilter}
     ORDER BY o.created_at DESC
     LIMIT $2 OFFSET $3`,
    params
  );

  const orders = [];
  for (const row of result.rows) {
    const items = await query(
      `SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at`,
      [row.id]
    );
    const payment = await query(
      `SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [row.id]
    );
    const shipment = await query(
      `SELECT * FROM shipments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [row.id]
    );
    orders.push(
      toOrder(row, {
        items: items.rows.map(toOrderItem),
        payment: toPayment(payment.rows[0]),
        shipment: toShipment(shipment.rows[0]),
      })
    );
  }
  return orders;
};

const countByUser = async (userId) => {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM orders WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0]?.count || 0;
};

const findByIdForUser = async (id, userId) => {
  const result = await query(
    `SELECT * FROM orders WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [id, userId]
  );
  if (!result.rows[0]) return null;

  const items = await query(
    `SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at`,
    [id]
  );
  const payment = await query(
    `SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [id]
  );
  const shipment = await query(
    `SELECT * FROM shipments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [id]
  );
  const timeline = await query(
    `SELECT status, note, created_at FROM order_status_events
     WHERE order_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return toOrder(result.rows[0], {
    items: items.rows.map(toOrderItem),
    payment: toPayment(payment.rows[0]),
    shipment: toShipment(shipment.rows[0]),
    timeline: timeline.rows.map((e) => ({
      status: e.status,
      note: e.note,
      createdAt: e.created_at,
    })),
  });
};

const findByOrderNumber = async (orderNumber, userId = null) => {
  const params = [orderNumber];
  let userFilter = '';
  if (userId) {
    params.push(userId);
    userFilter = 'AND user_id = $2';
  }
  const result = await query(
    `SELECT * FROM orders WHERE order_number = $1 ${userFilter} LIMIT 1`,
    params
  );
  if (!result.rows[0]) return null;
  return findByIdForUser(result.rows[0].id, result.rows[0].user_id);
};

const findById = async (id) => {
  const result = await query(`SELECT * FROM orders WHERE id = $1 LIMIT 1`, [id]);
  if (!result.rows[0]) return null;
  return findByIdForUser(result.rows[0].id, result.rows[0].user_id);
};

const updateStatus = async (orderId, status, note = null, userId = null) => {
  const result = await query(
    `UPDATE orders SET
       status = $2,
       cancelled_at = CASE WHEN $2 = 'cancelled' THEN NOW() ELSE cancelled_at END,
       delivered_at = CASE WHEN $2 = 'delivered' THEN NOW() ELSE delivered_at END
     WHERE id = $1
     RETURNING *`,
    [orderId, status]
  );
  await query(
    `INSERT INTO order_status_events (order_id, status, note, created_by)
     VALUES ($1, $2, $3, $4)`,
    [orderId, status, note, userId]
  );

  if (status === 'delivered') {
    try {
      const storePartnerRepository = require('./storePartner.repository');
      await storePartnerRepository.creditEarningsForOrder(orderId);
    } catch (_err) {
      // Earnings credit is best-effort; order status already updated
    }
  }

  return toOrder(result.rows[0]);
};

const updatePayment = async (paymentId, fields) => {
  const map = {
    status: 'status',
    gatewayPaymentId: 'gateway_payment_id',
    gatewayOrderId: 'gateway_order_id',
    paidAt: 'paid_at',
    metadata: 'metadata',
  };
  const sets = [];
  const values = [];
  let i = 1;
  Object.entries(fields).forEach(([key, value]) => {
    const col = map[key];
    if (!col || value === undefined) return;
    sets.push(`${col} = $${i}`);
    values.push(key === 'metadata' ? JSON.stringify(value) : value);
    i += 1;
  });
  if (!sets.length) return null;
  values.push(paymentId);
  const result = await query(
    `UPDATE payments SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return toPayment(result.rows[0]);
};

const findPaymentByGatewayOrderId = async (gatewayOrderId) => {
  const result = await query(
    `SELECT * FROM payments WHERE gateway_order_id = $1 LIMIT 1`,
    [gatewayOrderId]
  );
  return toPayment(result.rows[0]);
};

const createShipment = async (data) => {
  const result = await query(
    `INSERT INTO shipments (
       order_id, carrier, shipment_status, awb_code, courier_name, tracking_url,
       shiprocket_order_id, shiprocket_shipment_id, label_url, estimated_delivery, metadata, shipped_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      data.orderId,
      data.carrier || 'shiprocket',
      data.status || 'created',
      data.awbCode || null,
      data.courierName || null,
      data.trackingUrl || null,
      data.shiprocketOrderId || null,
      data.shiprocketShipmentId || null,
      data.labelUrl || null,
      data.estimatedDelivery || null,
      JSON.stringify(data.metadata || {}),
      data.shippedAt || null,
    ]
  );
  return toShipment(result.rows[0]);
};

const updateShipment = async (id, fields) => {
  const map = {
    status: 'shipment_status',
    awbCode: 'awb_code',
    courierName: 'courier_name',
    trackingUrl: 'tracking_url',
    shiprocketOrderId: 'shiprocket_order_id',
    shiprocketShipmentId: 'shiprocket_shipment_id',
    labelUrl: 'label_url',
    estimatedDelivery: 'estimated_delivery',
    metadata: 'metadata',
    shippedAt: 'shipped_at',
    deliveredAt: 'delivered_at',
  };
  const sets = [];
  const values = [];
  let i = 1;
  Object.entries(fields).forEach(([key, value]) => {
    const col = map[key];
    if (!col || value === undefined) return;
    sets.push(`${col} = $${i}`);
    values.push(key === 'metadata' ? JSON.stringify(value) : value);
    i += 1;
  });
  if (!sets.length) return null;
  values.push(id);
  const result = await query(
    `UPDATE shipments SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return toShipment(result.rows[0]);
};

module.exports = {
  createWithItems,
  listByUser,
  countByUser,
  findByIdForUser,
  findByOrderNumber,
  findById,
  updateStatus,
  updatePayment,
  findPaymentByGatewayOrderId,
  createShipment,
  updateShipment,
  toOrder,
  toPayment,
  toShipment,
};
