import { createLocalStore } from '@/admin/lib/createLocalStore'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const seed = [
  {
    id: 'cp_1',
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    minOrder: 999,
    usageLimit: 500,
    used: 128,
    expiresAt: '2026-12-31',
    status: 'active',
    updatedAt: '2026-07-01T10:00:00.000Z',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'cp_2',
    code: 'CORP500',
    type: 'flat',
    value: 500,
    minOrder: 5000,
    usageLimit: 100,
    used: 42,
    expiresAt: '2026-09-30',
    status: 'active',
    updatedAt: '2026-06-15T10:00:00.000Z',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'cp_3',
    code: 'DIWALI25',
    type: 'percent',
    value: 25,
    minOrder: 2000,
    usageLimit: 200,
    used: 200,
    expiresAt: '2025-11-15',
    status: 'archived',
    updatedAt: '2025-11-16T10:00:00.000Z',
    createdAt: '2025-10-01T10:00:00.000Z',
  },
]

const store = createLocalStore('hm_admin_coupons_v1', seed, 'cp')
const hooks = createModuleHooks('coupons', store)

const defaults = {
  code: '',
  type: 'percent',
  value: 10,
  minOrder: 0,
  usageLimit: 100,
  used: 0,
  expiresAt: '',
  status: 'active',
}

const fields = [
  { name: 'code', label: 'Code', required: true },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    options: [
      { value: 'percent', label: 'Percent' },
      { value: 'flat', label: 'Flat (INR)' },
    ],
  },
  { name: 'value', label: 'Value', type: 'number', required: true },
  { name: 'minOrder', label: 'Min order (INR)', type: 'number' },
  { name: 'usageLimit', label: 'Usage limit', type: 'number' },
  { name: 'expiresAt', label: 'Expires', type: 'date' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'draft', label: 'Draft' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'type',
    header: 'Discount',
    cell: ({ row }) => (
      <TextCell muted>
        {row.original.type === 'percent'
          ? `${row.original.value}%`
          : `₹${row.original.value}`}
      </TextCell>
    ),
  },
  {
    accessorKey: 'used',
    header: 'Usage',
    cell: ({ row }) => (
      <TextCell muted>
        {row.original.used}/{row.original.usageLimit}
      </TextCell>
    ),
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires',
    cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function CouponsPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Coupons"
      description="Create promotional codes and track redemption."
      addLabel="Add Coupon"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search coupon codes…"
      getRowLabel={(row) => row.code}
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'draft', label: 'Draft' },
          { value: 'archived', label: 'Archived' },
        ],
      }}
    />
  )
}
