import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const supplierHooks = createErpHooks('suppliers')

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

export function SuppliersPage() {
  const suppliers = supplierHooks.useList()
  const createSupplier = supplierHooks.useCreate()
  const updateSupplier = supplierHooks.useUpdate()
  const removeSupplier = supplierHooks.useRemove()

  return (
    <AdminCrudPage
      title="Supplier Management"
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
  )
}
