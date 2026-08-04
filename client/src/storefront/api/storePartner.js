import { api } from '@/shared/lib/axios'

export const storePartnerApi = {
  register: (body) => api.post('/store-partners/register', body).then((r) => r.data.data),
  dashboard: () => api.get('/store-partners/me/dashboard').then((r) => r.data.data),
  updateProfile: (body) => api.patch('/store-partners/me/profile', body).then((r) => r.data.data),
  listProducts: () => api.get('/store-partners/me/products').then((r) => r.data.data),
  createProduct: (body) => api.post('/store-partners/me/products', body).then((r) => r.data.data),
  updateProduct: (id, body) =>
    api.patch(`/store-partners/me/products/${id}`, body).then((r) => r.data.data),
  deleteProduct: (id) => api.delete(`/store-partners/me/products/${id}`).then((r) => r.data.data),
  updateStock: (id, stock) =>
    api.patch(`/store-partners/me/products/${id}/stock`, { stock }).then((r) => r.data.data),
  listSales: () => api.get('/store-partners/me/sales').then((r) => r.data.data),
  earnings: () => api.get('/store-partners/me/earnings').then((r) => r.data.data),
  withdraw: (body) => api.post('/store-partners/me/withdrawals', body).then((r) => r.data.data),
}
