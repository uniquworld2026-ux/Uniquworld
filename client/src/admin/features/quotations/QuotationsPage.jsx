import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const hooks = createErpHooks('quotations')

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
