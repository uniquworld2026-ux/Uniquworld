import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const purchaseHooks = createErpHooks('purchases')

const purchaseDefaults = {
  poNumber: '',
  supplierName: '',
  status: 'draft',
  totalAmount: 0,
  expectedDate: '',
  notes: '',
}

const purchaseFields = [
  { name: 'poNumber', label: 'PO number', required: true },
  { name: 'supplierName', label: 'Supplier', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'ordered', label: 'Ordered' },
      { value: 'received', label: 'Received' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
  { name: 'totalAmount', label: 'Total (INR)', type: 'number' },
  { name: 'expectedDate', label: 'Expected date', type: 'date' },
  { name: 'notes', label: 'Notes', type: 'textarea' },
]

const purchaseColumns = [
  { accessorKey: 'poNumber', header: 'PO #', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
  { accessorKey: 'supplierName', header: 'Supplier', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
  },
  { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
]

export function PurchasesPage() {
  const purchases = purchaseHooks.useList()
  const createPo = purchaseHooks.useCreate()
  const updatePo = purchaseHooks.useUpdate()
  const removePo = purchaseHooks.useRemove()

  return (
    <AdminCrudPage
      title="Purchase Management"
      description="Raise and track purchase orders against suppliers."
      addLabel="New PO"
      data={purchases.data || []}
      isLoading={purchases.isLoading}
      createMutation={createPo}
      updateMutation={updatePo}
      deleteMutation={removePo}
      columns={purchaseColumns}
      fields={purchaseFields}
      defaults={purchaseDefaults}
      searchPlaceholder="Search POs…"
      statusFilter={{
        key: 'status',
        label: 'Status',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'ordered', label: 'Ordered' },
          { value: 'received', label: 'Received' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      }}
    />
  )
}
