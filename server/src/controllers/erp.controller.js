const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const config = require('../config');
const logger = require('../utils/logger');
const erpRepository = require('../repositories/erp.repository');
const otpRepository = require('../repositories/otp.repository');
const emailService = require('../services/email.service');
const { query } = require('../config/database');
const { rowToApi } = require('../repositories/erp.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { hashToken } = require('../utils/jwt');
const { generateOtpCode, otpExpiresAt } = require('../utils/otp');
const { OTP_PURPOSE } = require('../types/enums');
const { prepareProductImages } = require('../utils/catalogImages');
const memoryCache = require('../utils/cache');

const CATALOG_PRODUCTS_CACHE = 'catalog:public:products';
const CATALOG_CATEGORIES_CACHE = 'catalog:public:categories';
const CATALOG_CACHE_TTL_MS = 45_000;

function bustCatalogCache(moduleName) {
  if (moduleName === 'products' || moduleName === 'categories' || moduleName === 'reviews') {
    memoryCache.delPrefix(CATALOG_PRODUCTS_CACHE);
    memoryCache.delPrefix(CATALOG_CATEGORIES_CACHE);
  }
}

/**
 * Recompute catalog_products.rating / review_count from approved erp_reviews.
 * @param {{ productId?: string, productName?: string }} opts
 */
async function syncProductReviewStats({ productId, productName } = {}) {
  const id = productId ? String(productId).trim() : '';
  const name = productName ? String(productName).trim() : '';
  if (!id && !name) return;

  const stats = await query(
    `SELECT
       COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg_rating,
       COUNT(*)::int AS review_count
     FROM erp_reviews
     WHERE status = 'approved'
       AND (
         ($1 <> '' AND (product_id = $1 OR product_id = (
           SELECT slug FROM catalog_products WHERE id::text = $1 LIMIT 1
         )))
         OR ($2 <> '' AND LOWER(TRIM(product_name)) = LOWER(TRIM($2)))
       )`,
    [id, name]
  );

  const avg = Number(stats.rows[0]?.avg_rating) || 0;
  const count = Number(stats.rows[0]?.review_count) || 0;
  const ratingValue = count > 0 ? avg : null;

  await query(
    `UPDATE catalog_products
     SET rating = $1,
         review_count = $2,
         updated_at = NOW()
     WHERE ($3 <> '' AND id::text = $3)
        OR ($4 <> '' AND LOWER(TRIM(name)) = LOWER(TRIM($4)))`,
    [ratingValue, count, id, name]
  );
}

/** Strip manual rating fields — shop stats come from approved reviews only. */
function stripManualProductReviewFields(body = {}) {
  const next = { ...(body || {}) };
  delete next.rating;
  delete next.reviewCount;
  delete next.review_count;
  return next;
}

const prepareAdminUserPayload = async (body, { requirePassword = false } = {}) => {
  const payload = { ...(body || {}) };
  delete payload.passwordHash;

  const password = payload.password;
  delete payload.password;

  if (password) {
    if (!String(password).trim()) {
      throw ApiError.badRequest('Password is required');
    }
    payload.passwordHash = await hashPassword(String(password));
  } else if (requirePassword) {
    throw ApiError.badRequest('Password is required to create an admin user');
  }

  if (payload.email) {
    payload.email = String(payload.email).trim().toLowerCase();
  }

  return payload;
};

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
  let body = req.body || {};
  if (req.params.module === 'admin-users') {
    body = await prepareAdminUserPayload(body, { requirePassword: true });
  } else if (req.params.module === 'products') {
    body = stripManualProductReviewFields(body);
    body.rating = null;
    body.reviewCount = 0;
    try {
      body = await prepareProductImages(body);
    } catch (err) {
      throw ApiError.badRequest(
        err.message?.includes('Storage')
          ? 'Image upload failed. Check Supabase storage bucket settings.'
          : 'Could not process product images. Try smaller images (under 2 MB each).',
      );
    }
  }
  const item = await erpRepository.create(req.params.module, body);
  if (req.params.module === 'reviews') {
    await syncProductReviewStats({
      productId: item.productId,
      productName: item.productName,
    });
  }
  bustCatalogCache(req.params.module);
  return ApiResponse.created(res, { item }, 'Created');
});

const update = asyncHandler(async (req, res) => {
  let body = req.body || {};
  let previousReview = null;
  if (req.params.module === 'admin-users') {
    body = await prepareAdminUserPayload(body, { requirePassword: false });
  } else if (req.params.module === 'products') {
    body = stripManualProductReviewFields(body);
    try {
      body = await prepareProductImages(body);
    } catch (err) {
      throw ApiError.badRequest(
        err.message?.includes('Storage')
          ? 'Image upload failed. Check Supabase storage bucket settings.'
          : 'Could not process product images. Try smaller images (under 2 MB each).',
      );
    }
  } else if (req.params.module === 'reviews') {
    previousReview = await erpRepository.getById('reviews', req.params.id);
  }
  const item = await erpRepository.update(req.params.module, req.params.id, body);
  if (req.params.module === 'reviews') {
    await syncProductReviewStats({
      productId: item.productId || previousReview?.productId,
      productName: item.productName || previousReview?.productName,
    });
    // If the review moved to another product, refresh the old product too.
    if (
      previousReview?.productId &&
      item.productId &&
      String(previousReview.productId) !== String(item.productId)
    ) {
      await syncProductReviewStats({
        productId: previousReview.productId,
        productName: previousReview.productName,
      });
    }
  }
  bustCatalogCache(req.params.module);
  return ApiResponse.ok(res, { item }, 'Updated');
});

const toAdminUser = (admin) => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
  roleSlug: admin.roleSlug,
  department: admin.department,
  avatarUrl: admin.avatarUrl || '',
  phone: admin.phone || '',
  status: admin.status,
});

/**
 * Step 1 — validate password, email OTP for admin portal.
 */
const adminLogin = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    throw ApiError.badRequest('Email and password are required');
  }

  const admin = await erpRepository.findAdminByEmail(email);
  if (!admin || admin.status !== 'active') {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!admin.passwordHash) {
    throw ApiError.unauthorized('Account has no password set. Ask a super admin to reset it.');
  }

  const ok = await comparePassword(password, admin.passwordHash);
  if (!ok) throw ApiError.unauthorized('Invalid email or password');

  const code = generateOtpCode();
  await otpRepository.create({
    userId: null,
    email: admin.email,
    codeHash: hashToken(code),
    purpose: OTP_PURPOSE.ADMIN_LOGIN,
    expiresAt: otpExpiresAt(),
    maxAttempts: config.otp.maxAttempts,
  });

  if (!emailService.isEmailConfigured()) {
    throw ApiError.serviceUnavailable(
      'Email is not configured. Set RESEND_API_KEY (recommended) or SMTP_* in server/.env.'
    );
  }

  try {
    await emailService.sendOtpEmail({
      to: admin.email,
      code,
      purpose: OTP_PURPOSE.ADMIN_LOGIN,
      firstName: admin.name?.split?.(' ')?.[0] || admin.name,
    });
  } catch (err) {
    throw ApiError.serviceUnavailable(
      `Could not send OTP email to ${admin.email}. Check SMTP settings / spam folder. ${err.message || ''}`
    );
  }

  // Development-only: OTP is never returned in the API response; check server logs if mail is delayed.
  if (config.env === 'development') {
    logger.info('Admin login OTP issued (check email; spam folder if missing)', {
      email: admin.email,
      otp: code,
    });
  }

  return ApiResponse.ok(
    res,
    {
      requiresOtp: true,
      purpose: OTP_PURPOSE.ADMIN_LOGIN,
      email: admin.email,
      message: `OTP sent to ${admin.email}. Check your Primary inbox.`,
      otp: {
        expiresInMinutes: config.otp.expiresInMinutes,
      },
    },
    'OTP sent'
  );
});

/**
 * Step 2 — verify admin login OTP and return session user.
 */
const adminVerifyOtp = asyncHandler(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const code = String(req.body?.code || '').trim();

  if (!email || !code) {
    throw ApiError.badRequest('Email and OTP code are required');
  }

  const otp = await otpRepository.findLatestActive(email, OTP_PURPOSE.ADMIN_LOGIN);
  if (!otp) {
    throw ApiError.badRequest('OTP expired or not found. Request a new one.');
  }
  if (otp.attempts >= otp.max_attempts) {
    throw ApiError.tooManyRequests('Maximum OTP attempts exceeded');
  }

  if (hashToken(code) !== otp.code_hash) {
    await otpRepository.incrementAttempts(otp.id);
    throw ApiError.badRequest('Invalid OTP');
  }

  await otpRepository.markVerified(otp.id);

  const admin = await erpRepository.findAdminByEmail(email);
  if (!admin || admin.status !== 'active') {
    throw ApiError.unauthorized('Admin account not found or inactive');
  }

  await erpRepository.touchAdminLogin(admin.id);

  return ApiResponse.ok(
    res,
    { user: toAdminUser(admin) },
    'Signed in'
  );
});

const remove = asyncHandler(async (req, res) => {
  let previousReview = null;
  if (req.params.module === 'reviews') {
    previousReview = await erpRepository.getById('reviews', req.params.id);
  }
  await erpRepository.remove(req.params.module, req.params.id);
  if (previousReview) {
    await syncProductReviewStats({
      productId: previousReview.productId,
      productName: previousReview.productName,
    });
  }
  bustCatalogCache(req.params.module);
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
    items: result.rows.map((r) => {
      const item = rowToApi(r);
      const meta = item.metadata && typeof item.metadata === 'object' ? item.metadata : {};
      const deliveryMode =
        meta.deliveryMode || (item.carrier === 'manual' ? 'manual' : 'auto');
      return {
        ...item,
        orderNumber: r.order_number,
        status: r.shipment_status,
        deliveryMode,
      };
    }),
  });
});

/**
 * Create shipment — deliveryMode:
 *  - manual: admin enters courier/AWB (hand delivery, local courier, etc.)
 *  - auto: create via Shiprocket (or stub when Shiprocket is not configured)
 */
const createShipment = asyncHandler(async (req, res) => {
  const orderRepository = require('../repositories/order.repository');
  const shiprocketService = require('../services/shiprocket.service');

  const {
    orderId,
    orderNumber,
    deliveryMode = 'manual',
    carrier,
    courierName,
    awbCode,
    trackingUrl,
    status,
    estimatedDelivery,
    notes,
  } = req.body || {};

  let order = null;
  if (orderId) {
    order = await orderRepository.findById(orderId);
  } else if (orderNumber) {
    order = await orderRepository.findByOrderNumber(String(orderNumber).trim());
  }
  if (!order) throw ApiError.badRequest('Valid orderId or orderNumber is required');

  const mode = deliveryMode === 'auto' ? 'auto' : 'manual';
  let shipmentPayload;

  if (mode === 'auto') {
    const shipmentData = await shiprocketService.createShipmentForOrder(order);
    shipmentPayload = {
      orderId: order.id,
      ...shipmentData,
      status: status || shipmentData.status || 'created',
      courierName: courierName || shipmentData.courierName,
      awbCode: awbCode || shipmentData.awbCode,
      trackingUrl: trackingUrl || shipmentData.trackingUrl,
      estimatedDelivery: estimatedDelivery || null,
      metadata: {
        ...(shipmentData.metadata || {}),
        deliveryMode: 'auto',
        notes: notes || undefined,
      },
    };
  } else {
    if (!courierName && !awbCode) {
      throw ApiError.badRequest('For manual delivery, provide courierName and/or awbCode');
    }
    const nextStatus = status || 'created';
    shipmentPayload = {
      orderId: order.id,
      carrier: carrier || 'manual',
      status: nextStatus,
      courierName: courierName || 'Manual delivery',
      awbCode: awbCode || null,
      trackingUrl: trackingUrl || null,
      estimatedDelivery: estimatedDelivery || null,
      shippedAt: ['picked_up', 'in_transit', 'out_for_delivery', 'delivered'].includes(nextStatus)
        ? new Date().toISOString()
        : null,
      metadata: {
        deliveryMode: 'manual',
        notes: notes || undefined,
        createdBy: 'admin',
      },
    };
  }

  const shipment = await orderRepository.createShipment(shipmentPayload);
  return ApiResponse.created(
    res,
    {
      item: {
        ...shipment,
        orderNumber: order.orderNumber,
        deliveryMode: mode,
      },
    },
    mode === 'manual' ? 'Manual delivery created' : 'Shipment created'
  );
});

const updateShipment = asyncHandler(async (req, res) => {
  const fields = req.body || {};
  const map = {
    status: 'shipment_status',
    carrier: 'carrier',
    awbCode: 'awb_code',
    courierName: 'courier_name',
    trackingUrl: 'tracking_url',
    estimatedDelivery: 'estimated_delivery',
    labelUrl: 'label_url',
    shippedAt: 'shipped_at',
    deliveredAt: 'delivered_at',
  };

  const sets = [];
  const params = [];

  Object.entries(map).forEach(([api, col]) => {
    if (fields[api] === undefined) return;
    params.push(fields[api] === '' ? null : fields[api]);
    sets.push(`${col} = $${params.length}`);
  });

  if (fields.status === 'delivered' && fields.deliveredAt === undefined) {
    params.push(new Date().toISOString());
    sets.push(`delivered_at = $${params.length}`);
  }
  if (
    ['picked_up', 'in_transit', 'out_for_delivery', 'delivered'].includes(fields.status) &&
    fields.shippedAt === undefined
  ) {
    params.push(new Date().toISOString());
    sets.push(`shipped_at = COALESCE(shipped_at, $${params.length})`);
  }

  if (fields.notes !== undefined || fields.deliveryMode !== undefined) {
    const metaPatch = {};
    if (fields.notes !== undefined) metaPatch.notes = fields.notes;
    if (fields.deliveryMode !== undefined) metaPatch.deliveryMode = fields.deliveryMode;
    params.push(JSON.stringify(metaPatch));
    sets.push(`metadata = COALESCE(metadata, '{}'::jsonb) || $${params.length}::jsonb`);
  }

  if (!sets.length) throw ApiError.badRequest('No fields to update');
  params.push(req.params.id);
  const result = await query(
    `UPDATE shipments SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
    params
  );
  if (!result.rows[0]) throw ApiError.notFound('Shipment not found');

  const row = result.rows[0];
  const orderResult = await query(`SELECT order_number FROM orders WHERE id = $1`, [row.order_id]);
  const item = rowToApi(row);
  const meta = item.metadata && typeof item.metadata === 'object' ? item.metadata : {};
  return ApiResponse.ok(res, {
    item: {
      ...item,
      orderNumber: orderResult.rows[0]?.order_number,
      status: row.shipment_status,
      deliveryMode: meta.deliveryMode || (row.carrier === 'manual' ? 'manual' : 'auto'),
    },
  });
});

const deleteShipment = asyncHandler(async (req, res) => {
  const result = await query(`DELETE FROM shipments WHERE id = $1 RETURNING id`, [req.params.id]);
  if (!result.rows[0]) throw ApiError.notFound('Shipment not found');
  return ApiResponse.ok(res, null, 'Shipment deleted');
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

/** Public gift catalog (admin Product Management → storefront) */
const listPublicCatalogProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 200;
  const cacheKey = `${CATALOG_PRODUCTS_CACHE}:${limit}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    return ApiResponse.ok(res, cached);
  }

  const result = await query(
    `SELECT p.id, p.name, p.slug, p.sku, p.description, p.instruction, p.category, p.categories,
            p.brand, p.price, p.compare_at_price, p.stock, p.low_stock_at, p.image_url, p.gallery,
            p.status, p.featured, p.trending, p.meta, p.created_at, p.updated_at,
            CASE WHEN r.review_count > 0 THEN r.avg_rating ELSE NULL END AS rating,
            COALESCE(r.review_count, 0)::int AS review_count
     FROM catalog_products p
     LEFT JOIN LATERAL (
       SELECT
         ROUND(AVG(er.rating)::numeric, 1) AS avg_rating,
         COUNT(*)::int AS review_count
       FROM erp_reviews er
       WHERE er.status = 'approved'
         AND (
           er.product_id = p.id::text
           OR er.product_id = p.slug
           OR LOWER(TRIM(er.product_name)) = LOWER(TRIM(p.name))
         )
     ) r ON TRUE
     WHERE p.status IN ('published', 'active')
     ORDER BY p.featured DESC, p.updated_at DESC
     LIMIT $1`,
    [limit]
  );
  const payload = {
    items: result.rows.map((row) => {
      const item = rowToApi(row);
      return {
        ...item,
        galleryImages: Array.isArray(item.gallery) ? item.gallery : [],
      };
    }),
  };
  memoryCache.set(cacheKey, payload, CATALOG_CACHE_TTL_MS);
  return ApiResponse.ok(res, payload);
});

const getPublicCatalogProduct = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*,
            CASE WHEN r.review_count > 0 THEN r.avg_rating ELSE NULL END AS rating,
            COALESCE(r.review_count, 0)::int AS review_count
     FROM catalog_products p
     LEFT JOIN LATERAL (
       SELECT
         ROUND(AVG(er.rating)::numeric, 1) AS avg_rating,
         COUNT(*)::int AS review_count
       FROM erp_reviews er
       WHERE er.status = 'approved'
         AND (
           er.product_id = p.id::text
           OR er.product_id = p.slug
           OR LOWER(TRIM(er.product_name)) = LOWER(TRIM(p.name))
         )
     ) r ON TRUE
     WHERE (p.slug = $1 OR p.id::text = $1) AND p.status IN ('published', 'active')
     LIMIT 1`,
    [req.params.idOrSlug]
  );
  if (!result.rows[0]) throw ApiError.notFound('Product not found');
  const item = rowToApi(result.rows[0]);
  return ApiResponse.ok(res, {
    item: { ...item, galleryImages: Array.isArray(item.gallery) ? item.gallery : [] },
  });
});

const listPublicCatalogCategories = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 100;
  const cacheKey = `${CATALOG_CATEGORIES_CACHE}:${limit}`;
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    return ApiResponse.ok(res, cached);
  }

  const result = await query(
    `SELECT * FROM catalog_categories
     WHERE status IN ('published', 'active')
     ORDER BY sort_order ASC, name ASC
     LIMIT $1`,
    [limit]
  );
  const payload = { items: result.rows.map(rowToApi) };
  memoryCache.set(cacheKey, payload, CATALOG_CACHE_TTL_MS);
  return ApiResponse.ok(res, payload);
});

function averageReviewRating(rows = []) {
  if (!rows.length) return null;
  const sum = rows.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
  return Math.round((sum / rows.length) * 10) / 10;
}

/** Public approved reviews for one catalog product (by id or slug). */
const listPublicCatalogProductReviews = asyncHandler(async (req, res) => {
  const idOrSlug = String(req.params.idOrSlug || '').trim();
  if (!idOrSlug) throw ApiError.badRequest('Product id or slug is required');

  const productResult = await query(
    `SELECT id, name, slug FROM catalog_products
     WHERE (slug = $1 OR id::text = $1) AND status IN ('published', 'active')
     LIMIT 1`,
    [idOrSlug]
  );
  const product = productResult.rows[0];
  if (!product) throw ApiError.notFound('Product not found');

  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const result = await query(
    `SELECT id, product_id, product_name, author, rating, title, body, status, created_at, updated_at
     FROM erp_reviews
     WHERE status = 'approved'
       AND (
         product_id = $1
         OR product_id = $2
         OR LOWER(TRIM(product_name)) = LOWER(TRIM($3))
       )
     ORDER BY created_at DESC
     LIMIT $4`,
    [String(product.id), product.slug, product.name, limit]
  );

  const items = result.rows.map(rowToApi);
  return ApiResponse.ok(res, {
    items,
    rating: averageReviewRating(items),
    reviewCount: items.length,
    productId: product.id,
  });
});

/** Public featured / latest approved reviews (home, testimonials). */
const listPublicCatalogReviews = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 12, 48);
  const result = await query(
    `SELECT id, product_id, product_name, author, rating, title, body, status, created_at, updated_at
     FROM erp_reviews
     WHERE status = 'approved'
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  const items = result.rows.map(rowToApi);
  return ApiResponse.ok(res, {
    items,
    rating: averageReviewRating(items),
    reviewCount: items.length,
  });
});

/** Live dashboard aggregates for admin home */
const dashboardSummary = asyncHandler(async (_req, res) => {
  const [orders, payments, customers, products, inventory, shipments, storeProducts] =
    await Promise.all([
      query(`SELECT COUNT(*)::int AS count, COALESCE(SUM(total_amount),0) AS revenue FROM orders`),
      query(
        `SELECT COUNT(*)::int AS count,
                COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END),0) AS paid
         FROM payments`
      ),
      query(
        `SELECT COUNT(*)::int AS count FROM users u
         JOIN roles r ON r.id = u.role_id
         WHERE r.slug IN ('customer', 'corporate') AND u.deleted_at IS NULL`
      ),
      query(
        `SELECT COUNT(*)::int AS count,
                COUNT(*) FILTER (WHERE status IN ('published','active'))::int AS published
         FROM catalog_products`
      ),
      query(
        `SELECT COUNT(*)::int AS count,
                COUNT(*) FILTER (WHERE quantity <= reorder_level)::int AS low_stock
         FROM inventory_items`
      ),
      query(`SELECT COUNT(*)::int AS count FROM shipments`),
      query(
        `SELECT COUNT(*)::int AS count FROM store_products WHERE status = 'published'`
      ),
    ]);

  const latestOrders = await query(
    `SELECT id, order_number, status, total_amount, shipping_address_snap, created_at, updated_at
     FROM orders ORDER BY created_at DESC LIMIT 6`
  );

  const lowStock = await query(
    `SELECT sku, name, quantity AS qty, warehouse
     FROM inventory_items
     WHERE quantity <= reorder_level
     ORDER BY quantity ASC
     LIMIT 6`
  );

  const recentShipments = await query(
    `SELECT s.id, s.shipment_status, s.awb_code, s.updated_at, o.order_number
     FROM shipments s
     JOIN orders o ON o.id = s.order_id
     ORDER BY s.updated_at DESC LIMIT 5`
  );

  return ApiResponse.ok(res, {
    kpis: {
      revenue: Number(orders.rows[0]?.revenue || 0),
      orders: orders.rows[0]?.count || 0,
      paidAmount: Number(payments.rows[0]?.paid || 0),
      payments: payments.rows[0]?.count || 0,
      customers: customers.rows[0]?.count || 0,
      products: products.rows[0]?.count || 0,
      publishedProducts: products.rows[0]?.published || 0,
      inventoryItems: inventory.rows[0]?.count || 0,
      lowStock: inventory.rows[0]?.low_stock || 0,
      shipments: shipments.rows[0]?.count || 0,
      storeProducts: storeProducts.rows[0]?.count || 0,
    },
    latestOrders: latestOrders.rows.map((r) => ({
      id: r.id,
      orderNumber: r.order_number,
      status: r.status,
      total: Number(r.total_amount),
      customer: r.shipping_address_snap?.fullName || 'Customer',
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
    lowStock: lowStock.rows.map((r) => ({
      sku: r.sku,
      name: r.name,
      qty: r.qty,
      warehouse: r.warehouse,
    })),
    activities: recentShipments.rows.map((r) => ({
      text: `Shipment ${r.order_number} → ${r.shipment_status}${r.awb_code ? ` (${r.awb_code})` : ''}`,
      time: r.updated_at,
    })),
  });
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
  createShipment,
  updateShipment,
  deleteShipment,
  listCustomers,
  listPublicStoreProducts,
  getPublicStoreProduct,
  listPublicCatalogProducts,
  getPublicCatalogProduct,
  listPublicCatalogCategories,
  listPublicCatalogProductReviews,
  listPublicCatalogReviews,
  dashboardSummary,
  adminLogin,
  adminVerifyOtp,
};
