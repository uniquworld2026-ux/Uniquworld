const { query, getClient } = require('../config/database');

const toStore = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    type: row.type,
    city: row.city,
    state: row.state,
    address: row.address,
    managerName: row.manager_name,
    phone: row.phone,
    email: row.email,
    gstin: row.gstin,
    description: row.description,
    ownerUserId: row.owner_user_id,
    bankAccountName: row.bank_account_name,
    bankAccountNumber: row.bank_account_number,
    bankIfsc: row.bank_ifsc,
    bankName: row.bank_name,
    emailVerifiedAt: row.email_verified_at,
    approvedAt: row.approved_at,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const toProduct = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    storeId: row.store_id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    stock: row.stock,
    imageUrl: row.image_url,
    gallery: row.gallery || [],
    category: row.category,
    tags: row.tags || [],
    status: row.status,
    featured: Boolean(row.featured),
    meta: row.meta || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    storeName: row.store_name || undefined,
    storeCode: row.store_code || undefined,
  };
};

const toEarning = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    storeId: row.store_id,
    orderId: row.order_id,
    orderItemId: row.order_item_id,
    orderNumber: row.order_number,
    productName: row.product_name,
    grossAmount: Number(row.gross_amount),
    platformFee: Number(row.platform_fee),
    netAmount: Number(row.net_amount),
    status: row.status,
    earnedAt: row.earned_at,
    createdAt: row.created_at,
  };
};

const toWithdrawal = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    storeId: row.store_id,
    amount: Number(row.amount),
    status: row.status,
    bankAccountName: row.bank_account_name,
    bankAccountNumber: row.bank_account_number,
    bankIfsc: row.bank_ifsc,
    bankName: row.bank_name,
    note: row.note,
    adminNote: row.admin_note,
    requestedBy: row.requested_by,
    processedBy: row.processed_by,
    processedAt: row.processed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

const uniqueStoreCode = async (name) => {
  const base = slugify(name).slice(0, 24) || 'store';
  let code = base;
  let n = 0;
  while (true) {
    const existing = await query(`SELECT id FROM stores WHERE code = $1 LIMIT 1`, [code]);
    if (!existing.rows[0]) return code;
    n += 1;
    code = `${base}-${n}`;
  }
};

const findByOwnerUserId = async (userId) => {
  const result = await query(
    `SELECT * FROM stores WHERE owner_user_id = $1 ORDER BY created_at ASC LIMIT 1`,
    [userId]
  );
  return toStore(result.rows[0]);
};

const findById = async (id) => {
  const result = await query(`SELECT * FROM stores WHERE id = $1 LIMIT 1`, [id]);
  return toStore(result.rows[0]);
};

const findByEmail = async (email) => {
  const result = await query(
    `SELECT * FROM stores WHERE lower(email) = lower($1) LIMIT 1`,
    [email]
  );
  return toStore(result.rows[0]);
};

const createStore = async (fields) => {
  const code = fields.code || (await uniqueStoreCode(fields.name));
  const result = await query(
    `INSERT INTO stores (
       name, code, type, city, state, address, manager_name, phone, email,
       gstin, description, owner_user_id, bank_account_name, bank_account_number,
       bank_ifsc, bank_name, status, email_verified_at, approved_at
     ) VALUES (
       $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
     ) RETURNING *`,
    [
      fields.name,
      code,
      fields.type || 'partner',
      fields.city || null,
      fields.state || null,
      fields.address || null,
      fields.managerName || null,
      fields.phone || null,
      fields.email || null,
      fields.gstin || null,
      fields.description || null,
      fields.ownerUserId || null,
      fields.bankAccountName || null,
      fields.bankAccountNumber || null,
      fields.bankIfsc || null,
      fields.bankName || null,
      fields.status || 'pending_verification',
      fields.emailVerifiedAt || null,
      fields.approvedAt || null,
    ]
  );
  return toStore(result.rows[0]);
};

const updateStore = async (id, fields) => {
  const map = {
    name: 'name',
    code: 'code',
    type: 'type',
    city: 'city',
    state: 'state',
    address: 'address',
    managerName: 'manager_name',
    phone: 'phone',
    email: 'email',
    gstin: 'gstin',
    description: 'description',
    bankAccountName: 'bank_account_name',
    bankAccountNumber: 'bank_account_number',
    bankIfsc: 'bank_ifsc',
    bankName: 'bank_name',
    status: 'status',
    emailVerifiedAt: 'email_verified_at',
    approvedAt: 'approved_at',
    approvedBy: 'approved_by',
    ownerUserId: 'owner_user_id',
  };
  const sets = [];
  const values = [];
  let i = 1;
  Object.entries(fields).forEach(([key, value]) => {
    const col = map[key];
    if (!col || value === undefined) return;
    sets.push(`${col} = $${i}`);
    values.push(value);
    i += 1;
  });
  if (!sets.length) return findById(id);
  values.push(id);
  const result = await query(
    `UPDATE stores SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return toStore(result.rows[0]);
};

const listStores = async ({ limit = 100, offset = 0, status } = {}) => {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE status = $${params.length}`;
  }
  params.push(limit, offset);
  const result = await query(
    `SELECT s.*,
            u.email AS owner_email,
            u.first_name AS owner_first_name,
            u.last_name AS owner_last_name
     FROM stores s
     LEFT JOIN users u ON u.id = s.owner_user_id
     ${where}
     ORDER BY s.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return result.rows.map((row) => ({
    ...toStore(row),
    ownerEmail: row.owner_email,
    ownerFirstName: row.owner_first_name,
    ownerLastName: row.owner_last_name,
  }));
};

const listProductsByStore = async (storeId, { includeDrafts = true } = {}) => {
  const result = await query(
    `SELECT * FROM store_products
     WHERE store_id = $1
       AND ($2::boolean OR status = 'published')
     ORDER BY updated_at DESC`,
    [storeId, includeDrafts]
  );
  return result.rows.map(toProduct);
};

const findProductByIdForStore = async (productId, storeId) => {
  const result = await query(
    `SELECT * FROM store_products WHERE id = $1 AND store_id = $2 LIMIT 1`,
    [productId, storeId]
  );
  return toProduct(result.rows[0]);
};

const uniqueProductSlug = async (name) => {
  const base = slugify(name) || 'product';
  let slug = base;
  let n = 0;
  while (true) {
    const existing = await query(`SELECT id FROM store_products WHERE slug = $1 LIMIT 1`, [slug]);
    if (!existing.rows[0]) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
};

const createProduct = async (storeId, fields) => {
  const slug = fields.slug || (await uniqueProductSlug(fields.name));
  const result = await query(
    `INSERT INTO store_products (
       store_id, name, slug, sku, description, price, compare_at_price,
       stock, image_url, gallery, category, tags, status, featured, meta
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11,$12,$13,$14,$15::jsonb)
     RETURNING *`,
    [
      storeId,
      fields.name,
      slug,
      fields.sku || null,
      fields.description || null,
      fields.price ?? 0,
      fields.compareAtPrice ?? null,
      fields.stock ?? 0,
      fields.imageUrl || null,
      JSON.stringify(fields.gallery || []),
      fields.category || null,
      fields.tags || null,
      fields.status || 'draft',
      Boolean(fields.featured),
      JSON.stringify(fields.meta || {}),
    ]
  );
  return toProduct(result.rows[0]);
};

const updateProduct = async (productId, storeId, fields) => {
  const map = {
    name: 'name',
    slug: 'slug',
    sku: 'sku',
    description: 'description',
    price: 'price',
    compareAtPrice: 'compare_at_price',
    stock: 'stock',
    imageUrl: 'image_url',
    gallery: 'gallery',
    category: 'category',
    tags: 'tags',
    status: 'status',
    featured: 'featured',
    meta: 'meta',
  };
  const sets = [];
  const values = [];
  let i = 1;
  Object.entries(fields).forEach(([key, value]) => {
    const col = map[key];
    if (!col || value === undefined) return;
    if (key === 'gallery' || key === 'meta') {
      sets.push(`${col} = $${i}::jsonb`);
      values.push(JSON.stringify(value));
    } else {
      sets.push(`${col} = $${i}`);
      values.push(value);
    }
    i += 1;
  });
  if (!sets.length) return findProductByIdForStore(productId, storeId);
  values.push(productId, storeId);
  const result = await query(
    `UPDATE store_products SET ${sets.join(', ')}
     WHERE id = $${i} AND store_id = $${i + 1}
     RETURNING *`,
    values
  );
  return toProduct(result.rows[0]);
};

const deleteProduct = async (productId, storeId) => {
  const result = await query(
    `DELETE FROM store_products WHERE id = $1 AND store_id = $2 RETURNING id`,
    [productId, storeId]
  );
  return Boolean(result.rows[0]);
};

const listSales = async (storeId, { limit = 50, offset = 0 } = {}) => {
  const result = await query(
    `SELECT oi.*, o.order_number, o.status AS order_status, o.created_at AS ordered_at,
            o.delivered_at, o.platform_fee_amount
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE oi.store_id = $1
     ORDER BY o.created_at DESC
     LIMIT $2 OFFSET $3`,
    [storeId, limit, offset]
  );
  return result.rows.map((row) => ({
    id: row.id,
    orderId: row.order_id,
    orderNumber: row.order_number,
    orderStatus: row.order_status,
    productName: row.product_name,
    sku: row.sku,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    totalPrice: Number(row.total_price),
    platformFee: Number(row.platform_fee || 0),
    storeEarning: Number(row.store_earning || row.total_price),
    orderedAt: row.ordered_at,
    deliveredAt: row.delivered_at,
  }));
};

const getBalance = async (storeId) => {
  const available = await query(
    `SELECT COALESCE(SUM(net_amount), 0) AS total
     FROM store_earnings WHERE store_id = $1 AND status = 'available'`,
    [storeId]
  );
  const pendingWithdraw = await query(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM store_withdrawals
     WHERE store_id = $1 AND status IN ('pending', 'processing')`,
    [storeId]
  );
  const paid = await query(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM store_withdrawals WHERE store_id = $1 AND status = 'paid'`,
    [storeId]
  );
  const month = await query(
    `SELECT COALESCE(SUM(net_amount), 0) AS total
     FROM store_earnings
     WHERE store_id = $1
       AND earned_at >= date_trunc('month', NOW())`,
    [storeId]
  );
  const availableTotal = Number(available.rows[0].total);
  const pendingTotal = Number(pendingWithdraw.rows[0].total);
  return {
    availableBalance: Math.max(0, availableTotal - pendingTotal),
    pendingWithdrawal: pendingTotal,
    totalPaidOut: Number(paid.rows[0].total),
    monthEarnings: Number(month.rows[0].total),
    lifetimeEarnings: availableTotal + Number(paid.rows[0].total) + pendingTotal,
  };
};

const listEarnings = async (storeId, { limit = 50, offset = 0 } = {}) => {
  const result = await query(
    `SELECT * FROM store_earnings
     WHERE store_id = $1
     ORDER BY earned_at DESC
     LIMIT $2 OFFSET $3`,
    [storeId, limit, offset]
  );
  return result.rows.map(toEarning);
};

const listMonthlyEarnings = async (storeId) => {
  const result = await query(
    `SELECT to_char(date_trunc('month', earned_at), 'YYYY-MM') AS month,
            COALESCE(SUM(net_amount), 0) AS net_amount,
            COALESCE(SUM(gross_amount), 0) AS gross_amount,
            COALESCE(SUM(platform_fee), 0) AS platform_fee,
            COUNT(*)::int AS orders_count
     FROM store_earnings
     WHERE store_id = $1
     GROUP BY date_trunc('month', earned_at)
     ORDER BY date_trunc('month', earned_at) DESC
     LIMIT 12`,
    [storeId]
  );
  return result.rows.map((row) => ({
    month: row.month,
    netAmount: Number(row.net_amount),
    grossAmount: Number(row.gross_amount),
    platformFee: Number(row.platform_fee),
    ordersCount: row.orders_count,
  }));
};

const creditEarningsForOrder = async (orderId) => {
  const items = await query(
    `SELECT oi.*, o.order_number
     FROM order_items oi
     JOIN orders o ON o.id = oi.order_id
     WHERE oi.order_id = $1 AND oi.store_id IS NOT NULL`,
    [orderId]
  );
  if (!items.rows.length) return [];

  const credited = [];
  for (const row of items.rows) {
    const net = Number(row.store_earning != null ? row.store_earning : row.total_price);
    const fee = Number(row.platform_fee || 0);
    const result = await query(
      `INSERT INTO store_earnings (
         store_id, order_id, order_item_id, order_number, product_name,
         gross_amount, platform_fee, net_amount, status, earned_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'available', NOW())
       ON CONFLICT (order_item_id) DO NOTHING
       RETURNING *`,
      [
        row.store_id,
        orderId,
        row.id,
        row.order_number,
        row.product_name,
        Number(row.total_price),
        fee,
        net,
      ]
    );
    if (result.rows[0]) credited.push(toEarning(result.rows[0]));
  }
  return credited;
};

const createWithdrawal = async ({ storeId, amount, bank, note, requestedBy }) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const bal = await client.query(
      `SELECT COALESCE(SUM(net_amount), 0) AS available
       FROM store_earnings WHERE store_id = $1 AND status = 'available'`,
      [storeId]
    );
    const pending = await client.query(
      `SELECT COALESCE(SUM(amount), 0) AS pending
       FROM store_withdrawals
       WHERE store_id = $1 AND status IN ('pending', 'processing')`,
      [storeId]
    );
    const available = Number(bal.rows[0].available) - Number(pending.rows[0].pending);
    if (amount > available) {
      const err = new Error('Insufficient available balance');
      err.statusCode = 400;
      throw err;
    }
    const result = await client.query(
      `INSERT INTO store_withdrawals (
         store_id, amount, status, bank_account_name, bank_account_number,
         bank_ifsc, bank_name, note, requested_by
       ) VALUES ($1,$2,'pending',$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        storeId,
        amount,
        bank.bankAccountName || null,
        bank.bankAccountNumber || null,
        bank.bankIfsc || null,
        bank.bankName || null,
        note || null,
        requestedBy || null,
      ]
    );
    await client.query('COMMIT');
    return toWithdrawal(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const listWithdrawals = async (storeId, { limit = 50 } = {}) => {
  const result = await query(
    `SELECT * FROM store_withdrawals
     WHERE store_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [storeId, limit]
  );
  return result.rows.map(toWithdrawal);
};

const listAllWithdrawals = async ({ limit = 50, offset = 0, status } = {}) => {
  const params = [];
  let where = '';
  if (status) {
    params.push(status);
    where = `WHERE w.status = $${params.length}`;
  }
  params.push(limit, offset);
  const result = await query(
    `SELECT w.*, s.name AS store_name, s.code AS store_code
     FROM store_withdrawals w
     JOIN stores s ON s.id = w.store_id
     ${where}
     ORDER BY w.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return result.rows.map((row) => ({
    ...toWithdrawal(row),
    storeName: row.store_name,
    storeCode: row.store_code,
  }));
};

const updateWithdrawalStatus = async (id, { status, adminNote, processedBy }) => {
  const result = await query(
    `UPDATE store_withdrawals SET
       status = $2,
       admin_note = COALESCE($3, admin_note),
       processed_by = $4,
       processed_at = CASE WHEN $2 IN ('paid', 'rejected') THEN NOW() ELSE processed_at END
     WHERE id = $1
     RETURNING *`,
    [id, status, adminNote || null, processedBy || null]
  );
  if (result.rows[0] && status === 'paid') {
    // Mark oldest available earnings as withdrawn up to amount (simplified ledger)
    await query(
      `UPDATE store_earnings SET status = 'withdrawn'
       WHERE id IN (
         SELECT id FROM store_earnings
         WHERE store_id = $1 AND status = 'available'
         ORDER BY earned_at ASC
       )
       AND (
         SELECT COALESCE(SUM(net_amount), 0)
         FROM store_earnings e2
         WHERE e2.store_id = $1 AND e2.status = 'available' AND e2.earned_at <= store_earnings.earned_at
       ) <= $2`,
      [result.rows[0].store_id, Number(result.rows[0].amount)]
    );
  }
  return toWithdrawal(result.rows[0]);
};

const listPublicProducts = async ({ storeCode, limit = 48 } = {}) => {
  if (storeCode) {
    const result = await query(
      `SELECT sp.*, s.name AS store_name, s.code AS store_code
       FROM store_products sp
       JOIN stores s ON s.id = sp.store_id
       WHERE sp.status = 'published'
         AND s.code = $1
         AND s.status = 'active'
       ORDER BY sp.featured DESC, sp.updated_at DESC
       LIMIT $2`,
      [storeCode, limit]
    );
    return result.rows.map(toProduct);
  }
  const result = await query(
    `SELECT sp.*, s.name AS store_name, s.code AS store_code
     FROM store_products sp
     LEFT JOIN stores s ON s.id = sp.store_id
     WHERE sp.status = 'published'
     ORDER BY sp.featured DESC, sp.updated_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows.map(toProduct);
};

module.exports = {
  toStore,
  toProduct,
  findByOwnerUserId,
  findById,
  findByEmail,
  createStore,
  updateStore,
  listStores,
  listProductsByStore,
  findProductByIdForStore,
  createProduct,
  updateProduct,
  deleteProduct,
  listSales,
  getBalance,
  listEarnings,
  listMonthlyEarnings,
  creditEarningsForOrder,
  createWithdrawal,
  listWithdrawals,
  listAllWithdrawals,
  updateWithdrawalStatus,
  listPublicProducts,
  uniqueStoreCode,
  uniqueProductSlug,
  slugify,
};
