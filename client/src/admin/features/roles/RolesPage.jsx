import { useMemo } from 'react'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const hooks = createErpHooks('roles')

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

function formatPermissions(value) {
  if (Array.isArray(value)) return value.join(', ') || '—'
  if (value == null || value === '') return '—'
  return String(value)
}

function permissionsForForm(value) {
  if (Array.isArray(value)) return value[0] || 'read'
  if (typeof value === 'string' && value.trim()) return value
  return 'read'
}

function toPermissionsPayload(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch {
      /* single permission slug */
    }
    return [value]
  }
  return []
}

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
    cell: ({ getValue }) => <TextCell muted>{formatPermissions(getValue())}</TextCell>,
  },
  {
    accessorKey: 'users',
    header: 'Users',
    cell: ({ getValue }) => <TextCell muted>{getValue() ?? 0}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function RolesPage() {
  const { data: raw = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  const data = useMemo(
    () =>
      raw.map((row) => ({
        ...row,
        permissions: permissionsForForm(row.permissions),
        users: row.users ?? 0,
      })),
    [raw],
  )

  const createWrapped = {
    ...createMutation,
    mutateAsync: async (payload) =>
      createMutation.mutateAsync({
        name: payload.name,
        description: payload.description || '',
        permissions: toPermissionsPayload(payload.permissions),
        slug: String(payload.name || '')
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_'),
        status: payload.status || 'active',
      }),
  }

  const updateWrapped = {
    ...updateMutation,
    mutateAsync: async ({ id, data: row }) =>
      updateMutation.mutateAsync({
        id,
        data: {
          name: row.name,
          description: row.description || '',
          permissions: toPermissionsPayload(row.permissions),
          status: row.status || 'active',
        },
      }),
  }

  return (
    <AdminCrudPage
      title="Role Management"
      description="Define staff roles and permission scopes."
      addLabel="Add Role"
      data={data}
      isLoading={isLoading}
      createMutation={createWrapped}
      updateMutation={updateWrapped}
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
