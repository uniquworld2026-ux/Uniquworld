import { api } from '@/shared/lib/axios'
import { appConfig } from '@/config/appConfig'

const ADMIN_KEY = appConfig.adminApiKey

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

  /** ERP staff login — uses admin_users email + password (no admin key required) */
  adminLogin: (email, password) =>
    api.post('/erp/auth/login', { email, password }).then((r) => r.data.data.user),

  listOrders: (params) =>
    api.get('/erp/commerce/orders', adminConfig({ params })).then((r) => r.data.data.items),
  updateOrderStatus: (id, body) =>
    api.patch(`/erp/commerce/orders/${id}`, body, adminConfig()).then((r) => r.data.data.item),
  listPayments: (params) =>
    api.get('/erp/commerce/payments', adminConfig({ params })).then((r) => r.data.data.items),
  listShipments: (params) =>
    api.get('/erp/commerce/shipments', adminConfig({ params })).then((r) => r.data.data.items),
  createShipment: (body) =>
    api.post('/erp/commerce/shipments', body, adminConfig()).then((r) => r.data.data.item),
  updateShipment: (id, body) =>
    api.patch(`/erp/commerce/shipments/${id}`, body, adminConfig()).then((r) => r.data.data.item),
  deleteShipment: (id) =>
    api.delete(`/erp/commerce/shipments/${id}`, adminConfig()).then((r) => r.data),
  listCustomers: (params) =>
    api.get('/erp/commerce/customers', adminConfig({ params })).then((r) => r.data.data.items),
  dashboard: () =>
    api.get('/erp/dashboard', adminConfig()).then((r) => r.data.data),
}

export const catalogPublicApi = {
  listProducts: (params) =>
    api.get('/catalog/products', { params }).then((r) => r.data.data.items),
  getProduct: (idOrSlug) =>
    api.get(`/catalog/products/${idOrSlug}`).then((r) => r.data.data.item),
  listCategories: (params) =>
    api.get('/catalog/categories', { params }).then((r) => r.data.data.items),
}

export const storePublicApi = {
  listProducts: (params) =>
    api.get('/store/products', { params }).then((r) => r.data.data.items),
  getProduct: (slug) =>
    api.get(`/store/products/${slug}`).then((r) => r.data.data.item),
}
