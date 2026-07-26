const { query } = require('../config/database');
const ApiError = require('../utils/ApiError');

/**
 * Module registry: table + column map (API camelCase → DB snake_case)
 */
const MODULES = {
  suppliers: {
    table: 'suppliers',
    idPrefix: 'sup',
    columns: {
      name: 'name',
      code: 'code',
      contactName: 'contact_name',
      email: 'email',
      phone: 'phone',
      city: 'city',
      state: 'state',
      gstin: 'gstin',
      status: 'status',
      notes: 'notes',
    },
  },
  purchases: {
    table: 'purchase_orders',
    idPrefix: 'po',
    columns: {
      poNumber: 'po_number',
      supplierId: 'supplier_id',
      supplierName: 'supplier_name',
      status: 'status',
      totalAmount: 'total_amount',
      expectedDate: 'expected_date',
      notes: 'notes',
    },
  },
  vendors: {
    table: 'vendors',
    idPrefix: 'ven',
    columns: {
      name: 'name',
      code: 'code',
      serviceType: 'service_type',
      contactName: 'contact_name',
      email: 'email',
      phone: 'phone',
      city: 'city',
      status: 'status',
      rating: 'rating',
      notes: 'notes',
    },
  },
  'vendor-services': {
    table: 'vendor_services',
    idPrefix: 'vs',
    columns: {
      vendorId: 'vendor_id',
      vendorName: 'vendor_name',
      name: 'name',
      category: 'category',
      unitPrice: 'unit_price',
      status: 'status',
      description: 'description',
    },
  },
  inventory: {
    table: 'inventory_items',
    idPrefix: 'inv',
    columns: {
      sku: 'sku',
      name: 'name',
      warehouse: 'warehouse',
      quantity: 'quantity',
      reserved: 'reserved',
      reorderLevel: 'reorder_level',
      unitCost: 'unit_cost',
      status: 'status',
    },
  },
  fulfillment: {
    table: 'fulfillment_tasks',
    idPrefix: 'ff',
    columns: {
      taskNumber: 'task_number',
      orderRef: 'order_ref',
      warehouse: 'warehouse',
      assignee: 'assignee',
      status: 'status',
      priority: 'priority',
      notes: 'notes',
      dueAt: 'due_at',
    },
  },
  stores: {
    table: 'stores',
    idPrefix: 'str',
    columns: {
      name: 'name',
      code: 'code',
      type: 'type',
      city: 'city',
      state: 'state',
      address: 'address',
      managerName: 'manager_name',
      phone: 'phone',
      status: 'status',
    },
  },
  'store-products': {
    table: 'store_products',
    idPrefix: 'stp',
    columns: {
      storeId: 'store_id',
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
    },
  },
  'admin-users': {
    table: 'admin_users',
    idPrefix: 'adm',
    columns: {
      userId: 'user_id',
      name: 'name',
      email: 'email',
      phone: 'phone',
      roleSlug: 'role_slug',
      department: 'department',
      status: 'status',
      lastLoginAt: 'last_login_at',
      passwordHash: 'password_hash',
      avatarUrl: 'avatar_url',
    },
    /** Never expose hashed passwords in API responses */
    omitFromResponse: ['passwordHash'],
  },
  categories: {
    table: 'catalog_categories',
    idPrefix: 'cat',
    columns: {
      name: 'name',
      slug: 'slug',
      description: 'description',
      imageUrl: 'image_url',
      sortOrder: 'sort_order',
      status: 'status',
      meta: 'meta',
    },
  },
  products: {
    table: 'catalog_products',
    idPrefix: 'prd',
    columns: {
      name: 'name',
      slug: 'slug',
      sku: 'sku',
      description: 'description',
      instruction: 'instruction',
      category: 'category',
      categories: 'categories',
      brand: 'brand',
      price: 'price',
      compareAtPrice: 'compare_at_price',
      stock: 'stock',
      lowStockAt: 'low_stock_at',
      imageUrl: 'image_url',
      gallery: 'gallery',
      status: 'status',
      featured: 'featured',
      trending: 'trending',
      rating: 'rating',
      reviewCount: 'review_count',
      meta: 'meta',
    },
  },
  coupons: {
    table: 'erp_coupons',
    idPrefix: 'cp',
    columns: {
      code: 'code',
      type: 'type',
      value: 'value',
      minOrder: 'min_order',
      usageLimit: 'usage_limit',
      used: 'used',
      expiresAt: 'expires_at',
      status: 'status',
      notes: 'notes',
    },
  },
  reviews: {
    table: 'erp_reviews',
    idPrefix: 'rv',
    columns: {
      productId: 'product_id',
      productName: 'product_name',
      author: 'author',
      rating: 'rating',
      title: 'title',
      body: 'body',
      status: 'status',
    },
  },
  banners: {
    table: 'erp_banners',
    idPrefix: 'bn',
    columns: {
      title: 'title',
      subtitle: 'subtitle',
      imageUrl: 'image_url',
      linkUrl: 'link_url',
      placement: 'placement',
      sortOrder: 'sort_order',
      status: 'status',
    },
  },
  media: {
    table: 'erp_media',
    idPrefix: 'md',
    columns: {
      name: 'name',
      type: 'type',
      url: 'url',
      sizeKb: 'size_kb',
    },
  },
  cms: {
    table: 'erp_cms_pages',
    idPrefix: 'cms',
    columns: {
      title: 'title',
      slug: 'slug',
      excerpt: 'excerpt',
      body: 'body',
      status: 'status',
    },
  },
  notifications: {
    table: 'erp_notifications',
    idPrefix: 'nt',
    columns: {
      title: 'title',
      channel: 'channel',
      audience: 'audience',
      body: 'body',
      status: 'status',
      scheduledAt: 'scheduled_at',
    },
  },
  'corporate-enquiries': {
    table: 'erp_corporate_enquiries',
    idPrefix: 'ce',
    columns: {
      company: 'company',
      contact: 'contact',
      email: 'email',
      phone: 'phone',
      moq: 'moq',
      who: 'who',
      message: 'message',
      source: 'source',
      status: 'status',
    },
  },
  quotations: {
    table: 'erp_quotations',
    idPrefix: 'qt',
    columns: {
      quoteNumber: 'quote_number',
      company: 'company',
      contact: 'contact',
      email: 'email',
      amount: 'amount',
      status: 'status',
      notes: 'notes',
      validUntil: 'valid_until',
    },
  },
  'personalized-orders': {
    table: 'erp_personalized_orders',
    idPrefix: 'po',
    columns: {
      orderRef: 'order_ref',
      customerName: 'customer_name',
      email: 'email',
      productName: 'product_name',
      customization: 'customization',
      status: 'status',
      totalAmount: 'total_amount',
      notes: 'notes',
    },
  },
  roles: {
    table: 'erp_roles',
    idPrefix: 'role',
    columns: {
      name: 'name',
      slug: 'slug',
      description: 'description',
      permissions: 'permissions',
      status: 'status',
    },
  },
  'audit-logs': {
    table: 'erp_audit_logs',
    idPrefix: 'log',
    columns: {
      actor: 'actor',
      action: 'action',
      entity: 'entity',
      entityId: 'entity_id',
      details: 'details',
      status: 'status',
    },
  },
  settings: {
    table: 'erp_settings',
    idPrefix: 'set',
    columns: {
      key: 'key',
      value: 'value',
      label: 'label',
      status: 'status',
    },
  },
  blog: {
    table: 'erp_blog_posts',
    idPrefix: 'blog',
    columns: {
      title: 'title',
      slug: 'slug',
      excerpt: 'excerpt',
      body: 'body',
      coverUrl: 'cover_url',
      author: 'author',
      status: 'status',
      publishedAt: 'published_at',
    },
  },
};

const snakeToCamel = (str) =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

/** Coerce gallery/meta/tags to the shapes Postgres expects */
const normalizeJsonColumn = (dbCol, value) => {
  if (dbCol === 'tags') {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        /* fall through */
      }
      return value.split(',').map((t) => t.trim()).filter(Boolean);
    }
    return [];
  }
  if (dbCol === 'gallery' || dbCol === 'categories' || dbCol === 'permissions') {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return value ? [value] : [];
      }
    }
    return [];
  }
  if (dbCol === 'meta') {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      } catch {
        return {};
      }
    }
    return {};
  }
  if (dbCol === 'value' && typeof value === 'object') {
    return value;
  }
  return value;
};

const rowToApi = (row) => {
  if (!row) return null;
  const out = {};
  Object.entries(row).forEach(([key, value]) => {
    const camel = snakeToCamel(key);
    if (key === 'gallery' && value && !Array.isArray(value)) {
      out[camel] = [];
    } else if (key === 'categories' && value && !Array.isArray(value)) {
      out[camel] = [];
    } else {
      out[camel] = value;
    }
  });
  return out;
};

const sanitizeItem = (moduleName, item) => {
  if (!item) return item;
  const mod = MODULES[moduleName];
  const omit = mod?.omitFromResponse || [];
  if (!omit.length) return item;
  const next = { ...item };
  omit.forEach((key) => {
    delete next[key];
  });
  return next;
};

const getModule = (name) => {
  const mod = MODULES[name];
  if (!mod) throw ApiError.notFound(`Unknown ERP module: ${name}`);
  return mod;
};

const list = async (moduleName, { status, q, limit = 100, offset = 0 } = {}) => {
  const mod = getModule(moduleName);
  const params = [];
  const clauses = [];

  if (status) {
    params.push(status);
    clauses.push(`status = $${params.length}`);
  }

  if (q) {
    const searchable = Object.values(mod.columns).filter((c) =>
      [
        'name',
        'email',
        'sku',
        'code',
        'po_number',
        'task_number',
        'supplier_name',
        'vendor_name',
        'contact_name',
      ].includes(c)
    );
    if (searchable.length) {
      params.push(`%${q}%`);
      const idx = params.length;
      clauses.push(`(${searchable.map((c) => `${c}::text ILIKE $${idx}`).join(' OR ')})`);
    }
  }

  const whereSql = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  params.push(Number(limit) || 100);
  const limIdx = params.length;
  params.push(Number(offset) || 0);
  const offIdx = params.length;

  const result = await query(
    `SELECT * FROM ${mod.table}
     ${whereSql}
     ORDER BY updated_at DESC
     LIMIT $${limIdx} OFFSET $${offIdx}`,
    params
  );
  return result.rows.map((row) => sanitizeItem(moduleName, rowToApi(row)));
};

const getById = async (moduleName, id) => {
  const mod = getModule(moduleName);
  const result = await query(`SELECT * FROM ${mod.table} WHERE id = $1 LIMIT 1`, [id]);
  return sanitizeItem(moduleName, rowToApi(result.rows[0]));
};

const create = async (moduleName, payload) => {
  const mod = getModule(moduleName);
  const cols = [];
  const vals = [];
  const params = [];

  Object.entries(mod.columns).forEach(([apiKey, dbCol]) => {
    if (payload[apiKey] === undefined) return;
    cols.push(dbCol);
    params.push(normalizeJsonColumn(dbCol, payload[apiKey]));
    vals.push(`$${params.length}`);
  });

  if (!cols.length) throw ApiError.badRequest('No fields to insert');

  const result = await query(
    `INSERT INTO ${mod.table} (${cols.join(', ')})
     VALUES (${vals.join(', ')})
     RETURNING *`,
    params
  );
  return sanitizeItem(moduleName, rowToApi(result.rows[0]));
};

const update = async (moduleName, id, payload) => {
  const mod = getModule(moduleName);
  const sets = [];
  const params = [];

  Object.entries(mod.columns).forEach(([apiKey, dbCol]) => {
    if (payload[apiKey] === undefined) return;
    params.push(normalizeJsonColumn(dbCol, payload[apiKey]));
    sets.push(`${dbCol} = $${params.length}`);
  });

  if (!sets.length) throw ApiError.badRequest('No fields to update');
  params.push(id);

  const result = await query(
    `UPDATE ${mod.table} SET ${sets.join(', ')}
     WHERE id = $${params.length}
     RETURNING *`,
    params
  );
  if (!result.rows[0]) throw ApiError.notFound('Record not found');
  return sanitizeItem(moduleName, rowToApi(result.rows[0]));
};

const remove = async (moduleName, id) => {
  const mod = getModule(moduleName);
  const result = await query(
    `DELETE FROM ${mod.table} WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!result.rows[0]) throw ApiError.notFound('Record not found');
  return true;
};

/** Internal — includes passwordHash for ERP login verification */
const findAdminByEmail = async (email) => {
  const result = await query(
    `SELECT * FROM admin_users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    [String(email || '').trim()]
  );
  return rowToApi(result.rows[0]);
};

const touchAdminLogin = async (id) => {
  await query(`UPDATE admin_users SET last_login_at = NOW() WHERE id = $1`, [id]);
};

const listModuleNames = () => Object.keys(MODULES);

module.exports = {
  MODULES,
  list,
  getById,
  create,
  update,
  remove,
  listModuleNames,
  rowToApi,
  findAdminByEmail,
  touchAdminLogin,
};
