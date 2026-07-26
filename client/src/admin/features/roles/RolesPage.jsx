import { createLocalStore } from '@/admin/lib/createLocalStore'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const seed = [
  {
    id: 'role_1',
    name: 'Super Admin',
    description: 'Full access to all modules',
    permissions: 'all',
    users: 2,
    status: 'active',
    updatedAt: '2026-01-01T10:00:00.000Z',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'role_2',
    name: 'Catalog Manager',
    description: 'Products, categories, inventory, media',
    permissions: 'catalog',
    users: 4,
    status: 'active',
    updatedAt: '2026-03-12T10:00:00.000Z',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'role_3',
    name: 'Order Desk',
    description: 'Orders, customers, personalized requests',
    permissions: 'commerce',
    users: 6,
    status: 'active',
    updatedAt: '2026-04-02T10:00:00.000Z',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 'role_4',
    name: 'Viewer',
    description: 'Read-only dashboards and reports',
    permissions: 'read',
    users: 3,
    status: 'inactive',
    updatedAt: '2026-05-20T10:00:00.000Z',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
]

const store = createLocalStore('hm_admin_roles_v1', seed, 'role')
const hooks = createModuleHooks('roles', store)

const defaults = {
  name: '',
  description: '',
  permissions: 'read',
  users: 0,
  status: 'active',
}

const fields = [
  { name: 'name', label: 'Role name', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'permissions',
    label: 'Permission set',
    type: 'select',
    options: [
      { value: 'all', label: 'All' },
      { value: 'catalog', label: 'Catalog' },
      { value: 'commerce', label: 'Commerce' },
      { value: 'content', label: 'Content' },
      { value: 'read', label: 'Read only' },
    ],
  },
  { name: 'users', label: 'Assigned users', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'name',
    header: 'Role',
    cell: ({ row }) => (
      <div>
        <TextCell>{row.original.name}</TextCell>
        <p className="text-xs text-admin-text-muted">{row.original.description}</p>
      </div>
    ),
  },
  {
    accessorKey: 'permissions',
    header: 'Permissions',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'users',
    header: 'Users',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function RolesPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Role Management"
      description="Define staff roles and permission scopes."
      addLabel="Add Role"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search roles…"
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      }}
    />
  )
}
