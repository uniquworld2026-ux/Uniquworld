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
    },
  },
};

const snakeToCamel = (str) =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

const rowToApi = (row) => {
  if (!row) return null;
  const out = {};
  Object.entries(row).forEach(([key, value]) => {
    out[snakeToCamel(key)] = value;
  });
  return out;
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
  return result.rows.map(rowToApi);
};

const getById = async (moduleName, id) => {
  const mod = getModule(moduleName);
  const result = await query(`SELECT * FROM ${mod.table} WHERE id = $1 LIMIT 1`, [id]);
  return rowToApi(result.rows[0]);
};

const create = async (moduleName, payload) => {
  const mod = getModule(moduleName);
  const cols = [];
  const vals = [];
  const params = [];

  Object.entries(mod.columns).forEach(([apiKey, dbCol]) => {
    if (payload[apiKey] === undefined) return;
    cols.push(dbCol);
    params.push(
      apiKey === 'gallery' || apiKey === 'meta' || apiKey === 'tags'
        ? typeof payload[apiKey] === 'string'
          ? payload[apiKey]
          : JSON.stringify(payload[apiKey])
        : payload[apiKey]
    );
    vals.push(`$${params.length}`);
  });

  if (!cols.length) throw ApiError.badRequest('No fields to insert');

  // tags is text[] — handle specially
  const result = await query(
    `INSERT INTO ${mod.table} (${cols.join(', ')})
     VALUES (${vals.join(', ')})
     RETURNING *`,
    params.map((p, i) => {
      const col = cols[i];
      if (col === 'tags' && typeof p === 'string') {
        try {
          return JSON.parse(p);
        } catch {
          return p.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }
      if ((col === 'gallery' || col === 'meta') && typeof p === 'string') {
        try {
          return JSON.parse(p);
        } catch {
          return col === 'gallery' ? [] : {};
        }
      }
      return p;
    })
  );
  return rowToApi(result.rows[0]);
};

const update = async (moduleName, id, payload) => {
  const mod = getModule(moduleName);
  const sets = [];
  const params = [];

  Object.entries(mod.columns).forEach(([apiKey, dbCol]) => {
    if (payload[apiKey] === undefined) return;
    let value = payload[apiKey];
    if (dbCol === 'gallery' || dbCol === 'meta') {
      value = typeof value === 'string' ? value : JSON.stringify(value);
      try {
        value = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        value = dbCol === 'gallery' ? [] : {};
      }
    }
    if (dbCol === 'tags' && typeof value === 'string') {
      value = value.split(',').map((t) => t.trim()).filter(Boolean);
    }
    params.push(value);
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
  return rowToApi(result.rows[0]);
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
};
