const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const erpRepository = require('../repositories/erp.repository');
const { query } = require('../config/database');
const { rowToApi } = require('../repositories/erp.repository');

const list = asyncHandler(async (req, res) => {
  const items = await erpRepository.list(req.params.module, {
    status: req.query.status,
    q: req.query.q,
    limit: Number(req.query.limit) || 100,
    offset: Number(req.query.offset) || 0,
  });
  return ApiResponse.ok(res, { items });
});

const getOne = asyncHandler(async (req, res) => {
  const item = await erpRepository.getById(req.params.module, req.params.id);
  if (!item) throw ApiError.notFound('Record not found');
  return ApiResponse.ok(res, { item });
});

const create = asyncHandler(async (req, res) => {
  const item = await erpRepository.create(req.params.module, req.body);
  return ApiResponse.created(res, { item }, 'Created');
});

const update = asyncHandler(async (req, res) => {
  const item = await erpRepository.update(req.params.module, req.params.id, req.body);
  return ApiResponse.ok(res, { item }, 'Updated');
});

const remove = asyncHandler(async (req, res) => {
  await erpRepository.remove(req.params.module, req.params.id);
  return ApiResponse.ok(res, null, 'Deleted');
});

const listModules = asyncHandler(async (_req, res) => {
  return ApiResponse.ok(res, { modules: erpRepository.listModuleNames() });
});

/** Commerce ops — orders / payments / shipments for admin */
const listOrders = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT o.*, 
      (SELECT json_agg(oi.*) FROM order_items oi WHERE oi.order_id = o.id) AS items,
      (SELECT row_to_json(p.*) FROM payments p WHERE p.order_id = o.id ORDER BY p.created_at DESC LIMIT 1) AS payment,
      (SELECT row_to_json(s.*) FROM shipments s WHERE s.order_id = o.id ORDER BY s.created_at DESC LIMIT 1) AS shipment
     FROM orders o
     ORDER BY o.created_at DESC
     LIMIT $1 OFFSET $2`,
    [Number(req.query.limit) || 50, Number(req.query.offset) || 0]
  );
  const items = result.rows.map((row) => ({
    ...rowToApi(row),
    items: row.items || [],
    payment: row.payment ? rowToApi(row.payment) : null,
    shipment: row.shipment ? rowToApi(row.shipment) : null,
  }));
  return ApiResponse.ok(res, { items });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  if (!status) throw ApiError.badRequest('status is required');
  const result = await query(
    `UPDATE orders SET
       status = $2,
       cancelled_at = CASE WHEN $2 = 'cancelled' THEN NOW() ELSE cancelled_at END,
       delivered_at = CASE WHEN $2 = 'delivered' THEN NOW() ELSE delivered_at END
     WHERE id = $1
     RETURNING *`,
    [req.params.id, status]
  );
  if (!result.rows[0]) throw ApiError.notFound('Order not found');
  await query(
    `INSERT INTO order_status_events (order_id, status, note)
     VALUES ($1, $2, $3)`,
    [req.params.id, status, note || `Status set to ${status}`]
  );
  return ApiResponse.ok(res, { item: rowToApi(result.rows[0]) }, 'Order updated');
});

const listPayments = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*, o.order_number
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`,
    [Number(req.query.limit) || 50, Number(req.query.offset) || 0]
  );
  return ApiResponse.ok(res, {
    items: result.rows.map((r) => ({ ...rowToApi(r), orderNumber: r.order_number })),
  });
});

const listShipments = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT s.*, o.order_number
     FROM shipments s
     JOIN orders o ON o.id = s.order_id
     ORDER BY s.created_at DESC
     LIMIT $1 OFFSET $2`,
    [Number(req.query.limit) || 50, Number(req.query.offset) || 0]
  );
  return ApiResponse.ok(res, {
    items: result.rows.map((r) => ({ ...rowToApi(r), orderNumber: r.order_number })),
  });
});

const updateShipment = asyncHandler(async (req, res) => {
  const fields = req.body;
  const map = {
    status: 'shipment_status',
    awbCode: 'awb_code',
    courierName: 'courier_name',
    trackingUrl: 'tracking_url',
  };
  const sets = [];
  const params = [];
  Object.entries(map).forEach(([api, col]) => {
    if (fields[api] === undefined) return;
    params.push(fields[api]);
    sets.push(`${col} = $${params.length}`);
  });
  if (!sets.length) throw ApiError.badRequest('No fields to update');
  params.push(req.params.id);
  const result = await query(
    `UPDATE shipments SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  if (!result.rows[0]) throw ApiError.notFound('Shipment not found');
  return ApiResponse.ok(res, { item: rowToApi(result.rows[0]) });
});

const listCustomers = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.status,
            u.created_at, u.last_login_at,
            (SELECT COUNT(*)::int FROM orders o WHERE o.user_id = u.id) AS orders_count,
            (SELECT COALESCE(SUM(o.total_amount),0) FROM orders o WHERE o.user_id = u.id) AS total_spent
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE r.slug IN ('customer', 'corporate') AND u.deleted_at IS NULL
     ORDER BY u.created_at DESC
     LIMIT $1`,
    [Number(req.query.limit) || 100]
  );
  return ApiResponse.ok(res, {
    items: result.rows.map((r) => ({
      id: r.id,
      name: [r.first_name, r.last_name].filter(Boolean).join(' '),
      email: r.email,
      phone: r.phone,
      status: r.status,
      orders: r.orders_count,
      totalSpent: Number(r.total_spent),
      createdAt: r.created_at,
      lastLoginAt: r.last_login_at,
    })),
  });
});

/** Public storefront store products */
const listPublicStoreProducts = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT * FROM store_products
     WHERE status = 'published'
     ORDER BY featured DESC, updated_at DESC
     LIMIT $1`,
    [Number(req.query.limit) || 48]
  );
  return ApiResponse.ok(res, { items: result.rows.map(rowToApi) });
});

const getPublicStoreProduct = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT * FROM store_products WHERE slug = $1 AND status = 'published' LIMIT 1`,
    [req.params.slug]
  );
  if (!result.rows[0]) throw ApiError.notFound('Product not found');
  return ApiResponse.ok(res, { item: rowToApi(result.rows[0]) });
});

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
  listModules,
  listOrders,
  updateOrderStatus,
  listPayments,
  listShipments,
  updateShipment,
  listCustomers,
  listPublicStoreProducts,
  getPublicStoreProduct,
};
