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

  /** ERP staff login — password then email OTP */
  adminLogin: (email, password) =>
    api.post('/erp/auth/login', { email, password }).then((r) => r.data.data),
  adminVerifyOtp: (email, code) =>
    api.post('/erp/auth/verify-otp', { email, code }).then((r) => r.data.data.user),

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
  listProductReviews: (idOrSlug, params) =>
    api
      .get(`/catalog/products/${encodeURIComponent(idOrSlug)}/reviews`, { params })
      .then((r) => r.data.data),
  listReviews: (params) =>
    api.get('/catalog/reviews', { params }).then((r) => r.data.data),
}

export const storePublicApi = {
  listProducts: (params) =>
    api.get('/store/products', { params }).then((r) => r.data.data.items),
  getProduct: (slug) =>
    api.get(`/store/products/${slug}`).then((r) => r.data.data.item),
  listByStore: (code, params) =>
    api.get(`/store/by/${encodeURIComponent(code)}`, { params }).then((r) => r.data.data),
}

export const storePartnerAdminApi = {
  listStores: (params) =>
    api.get('/store-partners/admin/stores', adminConfig({ params })).then((r) => r.data.data.items),
  getStore: (id) =>
    api.get(`/store-partners/admin/stores/${id}`, adminConfig()).then((r) => r.data.data),
  createPartner: (body) =>
    api.post('/store-partners/admin/partners', body, adminConfig()).then((r) => r.data.data),
  listWithdrawals: (params) =>
    api.get('/store-partners/admin/withdrawals', adminConfig({ params })).then((r) => r.data.data.items),
  updateWithdrawal: (id, body) =>
    api.patch(`/store-partners/admin/withdrawals/${id}`, body, adminConfig()).then((r) => r.data.data.item),
}
