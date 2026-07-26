import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const supplierHooks = createErpHooks('suppliers')
const purchaseHooks = createErpHooks('purchases')

const supplierDefaults = {
  name: '',
  code: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  gstin: '',
  status: 'active',
  notes: '',
}

const supplierFields = [
  { name: 'name', label: 'Supplier name', required: true },
  { name: 'code', label: 'Code' },
  { name: 'contactName', label: 'Contact person' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'phone', label: 'Phone' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'gstin', label: 'GSTIN' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
  { name: 'notes', label: 'Notes', type: 'textarea' },
]

const supplierColumns = [
  { accessorKey: 'name', header: 'Supplier', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
  { accessorKey: 'code', header: 'Code', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
  { accessorKey: 'contactName', header: 'Contact', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
  { accessorKey: 'city', header: 'City', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
  { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
]

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
  const suppliers = supplierHooks.useList()
  const purchases = purchaseHooks.useList()
  const createPo = purchaseHooks.useCreate()
  const updatePo = purchaseHooks.useUpdate()
  const removePo = purchaseHooks.useRemove()
  const createSupplier = supplierHooks.useCreate()
  const updateSupplier = supplierHooks.useUpdate()
  const removeSupplier = supplierHooks.useRemove()

  return (
    <div className="space-y-10">
      <AdminCrudPage
        title="Purchase orders"
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
      <AdminCrudPage
        title="Suppliers"
        description="Manage supplier directory for procurement."
        addLabel="Add supplier"
        data={suppliers.data || []}
        isLoading={suppliers.isLoading}
        createMutation={createSupplier}
        updateMutation={updateSupplier}
        deleteMutation={removeSupplier}
        columns={supplierColumns}
        fields={supplierFields}
        defaults={supplierDefaults}
        searchPlaceholder="Search suppliers…"
        statusFilter={{
          key: 'status',
          label: 'Status',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
        }}
      />
    </div>
  )
}
