import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import {
  corporateEnquiriesStore,
  createCorporateEnquiry,
} from '@/admin/features/corporate/corporateEnquiriesStore'

const hooks = createModuleHooks('corporate-enquiries', {
  list: () => corporateEnquiriesStore.list(),
  getById: (id) => corporateEnquiriesStore.getById(id),
  create: createCorporateEnquiry,
  update: (id, data) => corporateEnquiriesStore.update(id, data),
  remove: (id) => corporateEnquiriesStore.remove(id),
})

const defaults = {
  company: '',
  contact: '',
  email: '',
  phone: '',
  moq: 'Medium',
  who: 'HR',
  message: '',
  source: 'admin',
  status: 'new',
}

const fields = [
  { name: 'company', label: 'Company / personal name', required: true },
  {
    name: 'moq',
    label: 'MOQ',
    type: 'select',
    options: [
      { value: 'Low', label: 'Low' },
      { value: 'Medium', label: 'Medium' },
      { value: 'High', label: 'High' },
    ],
  },
  {
    name: 'who',
    label: 'Who?',
    type: 'select',
    options: [
      { value: 'HR', label: 'HR' },
      { value: 'Prospector', label: 'Prospector' },
      { value: 'CEO', label: 'CEO' },
      { value: 'Other', label: 'Other' },
    ],
  },
  { name: 'phone', label: 'Mobile number', required: true },
  { name: 'message', label: 'Description', type: 'textarea' },
  { name: 'source', label: 'Source' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'new', label: 'New' },
      { value: 'open', label: 'Open' },
      { value: 'completed', label: 'Completed' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'company',
    header: 'Name',
    cell: ({ row }) => (
      <div>
        <TextCell>{row.original.company}</TextCell>
        <p className="text-xs text-admin-text-muted">{row.original.who || '—'}</p>
      </div>
    ),
  },
  {
    accessorKey: 'moq',
    header: 'MOQ',
    cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
  },
  {
    accessorKey: 'who',
    header: 'Who',
    cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
  },
  {
    accessorKey: 'phone',
    header: 'Mobile',
    cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
  },
  {
    accessorKey: 'message',
    header: 'Description',
    cell: ({ getValue }) => (
      <span className="line-clamp-2 max-w-[240px] text-sm text-admin-text-muted">
        {getValue() || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function CorporateEnquiriesPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Corporate Enquiries"
      description="Track enquiry form submissions — name, MOQ, role, mobile, and description."
      addLabel="Add Enquiry"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search name, mobile, MOQ…"
      getRowLabel={(row) => row.company}
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'new', label: 'New' },
          { value: 'open', label: 'Open' },
          { value: 'completed', label: 'Completed' },
          { value: 'rejected', label: 'Rejected' },
        ],
      }}
    />
  )
}
