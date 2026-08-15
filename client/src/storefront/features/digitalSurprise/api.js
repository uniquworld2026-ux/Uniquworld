import { api } from '@/shared/lib/axios'

export const digitalSurpriseApi = {
  listOccasions: () => api.get('/digital-surprises/occasions').then((r) => r.data.data),
  create: (body) => api.post('/digital-surprises', body).then((r) => r.data.data),
  checkout: (id) => api.post(`/digital-surprises/${id}/checkout`).then((r) => r.data.data),
  verifyPayment: (id, body) =>
    api.post(`/digital-surprises/${id}/verify-payment`, body).then((r) => r.data.data),
  getBySlug: (slug) => api.get(`/digital-surprises/s/${slug}`).then((r) => r.data.data),
  preview: (id) => api.post(`/digital-surprises/${id}/preview`).then((r) => r.data.data),
  uploadMusic: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api
      .post('/digital-surprises/music', fd, {
        timeout: 90000,
        transformRequest: [
          (data, headers) => {
            if (typeof headers.delete === 'function') headers.delete('Content-Type')
            else delete headers['Content-Type']
            return data
          },
        ],
      })
      .then((r) => r.data.data)
  },
}
