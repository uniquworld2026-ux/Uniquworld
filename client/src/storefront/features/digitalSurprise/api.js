import { api } from '@/shared/lib/axios'

export const digitalSurpriseApi = {
  listOccasions: () => api.get('/digital-surprises/occasions').then((r) => r.data.data),
  create: (body) => api.post('/digital-surprises', body).then((r) => r.data.data),
  checkout: (id) => api.post(`/digital-surprises/${id}/checkout`).then((r) => r.data.data),
  verifyPayment: (id, body) =>
    api.post(`/digital-surprises/${id}/verify-payment`, body).then((r) => r.data.data),
  getBySlug: (slug) => api.get(`/digital-surprises/s/${slug}`).then((r) => r.data.data),
  preview: (id) => api.post(`/digital-surprises/${id}/preview`).then((r) => r.data.data),
}
