import { createLocalStore } from '@/admin/lib/createLocalStore'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const seed = [
  {
    id: 'qt_1',
    quoteNumber: 'Q-2026-088',
    company: 'NovaTech Pvt Ltd',
    amount: 142500,
    validUntil: '2026-08-15',
    status: 'sent',
    updatedAt: '2026-07-21T10:00:00.000Z',
    createdAt: '2026-07-21T10:00:00.000Z',
  },
  {
    id: 'qt_2',
    quoteNumber: 'Q-2026-074',
    company: 'Cedar Bank',
    amount: 398000,
    validUntil: '2026-08-01',
    status: 'approved',
    updatedAt: '2026-07-18T10:00:00.000Z',
    createdAt: '2026-07-12T10:00:00.000Z',
  },
  {
    id: 'qt_3',
    quoteNumber: 'Q-2026-061',
    company: 'Bloom Studios',
    amount: 76500,
    validUntil: '2026-07-20',
    status: 'draft',
    updatedAt: '2026-07-05T10:00:00.000Z',
    createdAt: '2026-07-02T10:00:00.000Z',
  },
]

const store = createLocalStore('hm_admin_quotations_v1', seed, 'qt')
const hooks = createModuleHooks('quotations', store)

const defaults = {
  quoteNumber: '',
  company: '',
  amount: 0,
  validUntil: '',
  status: 'draft',
}

const fields = [
  { name: 'quoteNumber', label: 'Quote number', required: true },
  { name: 'company', label: 'Company', required: true },
  { name: 'amount', label: 'Amount (INR)', type: 'number', required: true },
  { name: 'validUntil', label: 'Valid until', type: 'date' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'sent', label: 'Sent' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'quoteNumber',
    header: 'Quote',
    cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
  },
  {
    accessorKey: 'validUntil',
    header: 'Valid until',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function QuotationsPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Quotation Management"
      description="Create and track corporate quotes through approval."
      addLabel="Add Quotation"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search quotations…"
      getRowLabel={(row) => row.quoteNumber}
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'sent', label: 'Sent' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ],
      }}
    />
  )
}
