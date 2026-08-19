import { api } from '@/shared/lib/axios'

export const authApi = {
  login: (body) => api.post('/auth/login', body).then((r) => r.data.data),
  register: (body) => api.post('/auth/register', body).then((r) => r.data.data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }).then((r) => r.data.data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }).then((r) => r.data.data),
  me: () => api.get('/auth/me').then((r) => r.data.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data.data),
  resetPassword: (body) => api.post('/auth/reset-password', body).then((r) => r.data.data),
  verifyOtp: (body) => api.post('/auth/verify-otp', body).then((r) => r.data.data),
  resendOtp: (body) => api.post('/auth/resend-otp', body).then((r) => r.data.data),
  checkoutStart: (body) => api.post('/auth/checkout/start', body).then((r) => r.data.data),
}

export const accountApi = {
  summary: () => api.get('/account/summary').then((r) => r.data.data),
  updateProfile: (body) => api.patch('/account/profile', body).then((r) => r.data.data),

  listAddresses: () => api.get('/account/addresses').then((r) => r.data.data.addresses),
  createAddress: (body) => api.post('/account/addresses', body).then((r) => r.data.data.address),
  updateAddress: (id, body) => api.patch(`/account/addresses/${id}`, body).then((r) => r.data.data.address),
  deleteAddress: (id) => api.delete(`/account/addresses/${id}`).then((r) => r.data),

  listOrders: (params) => api.get('/account/orders', { params }).then((r) => r.data.data.orders),
  getOrder: (id) => api.get(`/account/orders/${id}`).then((r) => r.data.data.order),
  placeOrder: (body) => api.post('/account/orders', body).then((r) => r.data.data),
  verifyPayment: (body) => api.post('/account/orders/verify-payment', body).then((r) => r.data.data.order),
  cancelOrder: (id, reason) => api.post(`/account/orders/${id}/cancel`, { reason }).then((r) => r.data.data.order),
  trackOrder: (id) => api.get(`/account/orders/${id}/track`).then((r) => r.data.data),
  requestReturn: (id, body) => api.post(`/account/orders/${id}/return`, body).then((r) => r.data.data.returnRequest),
  listReturns: () => api.get('/account/returns').then((r) => r.data.data.items),

  listWishlist: () => api.get('/account/wishlist').then((r) => r.data.data.items),
  addWishlist: (body) => api.post('/account/wishlist', body).then((r) => r.data.data.item),
  removeWishlist: (catalogKey) => api.delete(`/account/wishlist/${encodeURIComponent(catalogKey)}`).then((r) => r.data),
  reportCartAdd: (body) => api.post('/account/cart-activity', body).then((r) => r.data.data),

  listNotifications: () => api.get('/account/notifications').then((r) => r.data.data),
  markNotificationRead: (id) => api.post(`/account/notifications/${id}/read`).then((r) => r.data.data.item),
  markAllNotificationsRead: () => api.post('/account/notifications/read-all').then((r) => r.data),
}
