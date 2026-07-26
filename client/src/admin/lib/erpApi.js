import { api } from '@/shared/lib/axios'

const ADMIN_KEY = import.meta.env.VITE_ADMIN_API_KEY || 'uniquworld-admin-dev-key'

function adminConfig(extra = {}) {
  return {
    ...extra,
    headers: {
      ...(extra.headers || {}),
      'X-Admin-Key': ADMIN_KEY,
    },
  }
}

export const erpApi = {
  list: (module, params) =>
    api.get(`/erp/${module}`, adminConfig({ params })).then((r) => r.data.data.items),
  get: (module, id) =>
    api.get(`/erp/${module}/${id}`, adminConfig()).then((r) => r.data.data.item),
  create: (module, body) =>
    api.post(`/erp/${module}`, body, adminConfig()).then((r) => r.data.data.item),
  update: (module, id, body) =>
    api.patch(`/erp/${module}/${id}`, body, adminConfig()).then((r) => r.data.data.item),
  remove: (module, id) =>
    api.delete(`/erp/${module}/${id}`, adminConfig()).then((r) => r.data),

  listOrders: (params) =>
    api.get('/erp/commerce/orders', adminConfig({ params })).then((r) => r.data.data.items),
  updateOrderStatus: (id, body) =>
    api.patch(`/erp/commerce/orders/${id}`, body, adminConfig()).then((r) => r.data.data.item),
  listPayments: (params) =>
    api.get('/erp/commerce/payments', adminConfig({ params })).then((r) => r.data.data.items),
  listShipments: (params) =>
    api.get('/erp/commerce/shipments', adminConfig({ params })).then((r) => r.data.data.items),
  updateShipment: (id, body) =>
    api.patch(`/erp/commerce/shipments/${id}`, body, adminConfig()).then((r) => r.data.data.item),
  listCustomers: (params) =>
    api.get('/erp/commerce/customers', adminConfig({ params })).then((r) => r.data.data.items),
}

export const storePublicApi = {
  listProducts: (params) =>
    api.get('/store/products', { params }).then((r) => r.data.data.items),
  getProduct: (slug) =>
    api.get(`/store/products/${slug}`).then((r) => r.data.data.item),
}
