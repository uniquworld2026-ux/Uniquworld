import { createLocalStore } from '@/admin/lib/createLocalStore'

const seed = [
  {
    id: 'po_1',
    orderRef: 'PO-2201',
    customer: 'Guest',
    productId: 'prd_1006',
    product: 'Gold-Tone Keepsake Box',
    personalization: 'Engrave: A.K. — July 2026',
    customText: 'Engrave: A.K. — July 2026',
    photoName: '',
    photoDataUrl: '',
    status: 'processing',
    updatedAt: '2026-07-19T10:00:00.000Z',
    createdAt: '2026-07-18T10:00:00.000Z',
  },
  {
    id: 'po_2',
    orderRef: 'PO-2194',
    customer: 'Guest',
    productId: 'prd_1003',
    product: 'Linen Gift Wrap Kit',
    personalization: 'Monogram card: R & S',
    customText: 'Monogram card: R & S',
    photoName: '',
    photoDataUrl: '',
    status: 'pending',
    updatedAt: '2026-07-17T10:00:00.000Z',
    createdAt: '2026-07-17T09:00:00.000Z',
  },
]

export const personalizedOrdersStore = createLocalStore('hm_admin_personalized_v1', seed, 'po')

export function listPersonalizedOrders() {
  return personalizedOrdersStore.list()
}

export function createPersonalizedOrder(payload) {
  const orderRef = payload.orderRef || `PO-${Date.now().toString().slice(-6)}`
  const personalization =
    payload.personalization ||
    [payload.customText, payload.photoName ? `Photo: ${payload.photoName}` : '']
      .filter(Boolean)
      .join(' · ') ||
    'Customized order'

  return personalizedOrdersStore.create({
    orderRef,
    customer: payload.customer || 'Guest',
    productId: payload.productId || '',
    product: payload.product || '',
    personalization,
    customText: payload.customText || '',
    photoName: payload.photoName || '',
    photoDataUrl: payload.photoDataUrl || '',
    status: payload.status || 'pending',
  })
}
