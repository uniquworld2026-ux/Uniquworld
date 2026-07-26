import { createLocalStore } from '@/admin/lib/createLocalStore'

const seed = [
  {
    id: 'ce_1',
    company: 'NovaTech Pvt Ltd',
    contact: 'NovaTech Pvt Ltd',
    email: '',
    phone: '9876543210',
    moq: 'High',
    who: 'HR',
    budget: 150000,
    employees: 120,
    interest: 'MOQ: High · Role: HR',
    message: 'Diwali gifting for all employees — prefer sustainable packaging.',
    source: 'admin',
    status: 'new',
    updatedAt: '2026-07-21T10:00:00.000Z',
    createdAt: '2026-07-21T09:00:00.000Z',
  },
  {
    id: 'ce_2',
    company: 'Cedar Bank',
    contact: 'Cedar Bank',
    email: '',
    phone: '9123456780',
    moq: 'Medium',
    who: 'CEO',
    budget: 420000,
    employees: 350,
    interest: 'MOQ: Medium · Role: CEO',
    message: 'Client appreciation hampers for Q3.',
    source: 'admin',
    status: 'open',
    updatedAt: '2026-07-18T10:00:00.000Z',
    createdAt: '2026-07-17T10:00:00.000Z',
  },
  {
    id: 'ce_3',
    company: 'Bloom Studios',
    contact: 'Bloom Studios',
    email: '',
    phone: '9988776655',
    moq: 'Low',
    who: 'Prospector',
    budget: 85000,
    employees: 40,
    interest: 'MOQ: Low · Role: Prospector',
    message: 'Onboarding kits with branded notebooks.',
    source: 'admin',
    status: 'completed',
    updatedAt: '2026-07-10T10:00:00.000Z',
    createdAt: '2026-07-01T10:00:00.000Z',
  },
]

export const corporateEnquiriesStore = createLocalStore('hm_admin_corporate_v2', seed, 'ce')

export function listCorporateEnquiries() {
  return corporateEnquiriesStore.list()
}

export function createCorporateEnquiry(payload) {
  return corporateEnquiriesStore.create({
    company: payload.company || 'Website enquiry',
    contact: payload.contact || payload.company || '',
    email: payload.email || '',
    phone: payload.phone || '',
    moq: payload.moq || '',
    who: payload.who || '',
    budget: Number(payload.budget) || 0,
    employees: Number(payload.employees) || 0,
    interest: payload.interest || '',
    message: payload.message || '',
    source: payload.source || 'website',
    status: payload.status || 'new',
  })
}
