import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Avatar } from '@/shared/components/ui/Avatar'

const hooks = createErpHooks('admin-users')

export function AdminUsersPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  const createWrapped = {
    ...createMutation,
    mutateAsync: async (payload) => {
      if (!payload.password || String(payload.password).length < 6) {
        throw new Error('Password is required (min 6 characters) to create a login.')
      }
      return createMutation.mutateAsync({
        ...payload,
        email: String(payload.email || '').trim().toLowerCase(),
      })
    },
  }

  const updateWrapped = {
    ...updateMutation,
    mutateAsync: async ({ id, data }) => {
      const body = {
        ...data,
        email: String(data.email || '').trim().toLowerCase(),
      }
      // Empty password on edit = keep existing password
      if (!body.password) delete body.password
      return updateMutation.mutateAsync({ id, data: body })
    },
  }

  return (
    <AdminCrudPage
      title="Admin User Management"
      description="Create ERP staff with profile photo, email, and password — those credentials sign in at /admin/login."
      addLabel="Add admin user"
      entityLabel="Admin users"
      data={data}
      isLoading={isLoading}
      createMutation={createWrapped}
      updateMutation={updateWrapped}
      deleteMutation={deleteMutation}
      columns={[
        {
          accessorKey: 'name',
          header: 'User',
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              {row.original.avatarUrl ? (
                <img
                  src={row.original.avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-admin-border"
                />
              ) : (
                <Avatar name={row.original.name} size="sm" />
              )}
              <div>
                <TextCell>{row.original.name}</TextCell>
                <p className="text-xs text-admin-text-muted">{row.original.email}</p>
              </div>
            </div>
          ),
        },
        { accessorKey: 'roleSlug', header: 'Role', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'department', header: 'Department', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'phone', header: 'Phone', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[
        { name: 'avatarUrl', label: 'Profile image', type: 'image' },
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Login email', type: 'email', required: true },
        {
          name: 'password',
          label: 'Login password',
          type: 'password',
          placeholder: 'Min 6 characters (leave blank on edit to keep)',
        },
        { name: 'phone', label: 'Phone' },
        {
          name: 'roleSlug',
          label: 'Role',
          type: 'select',
          options: [
            { value: 'super_admin', label: 'Super Admin' },
            { value: 'admin', label: 'Admin' },
            { value: 'ops', label: 'Operations' },
            { value: 'warehouse', label: 'Warehouse' },
            { value: 'support', label: 'Support' },
          ],
        },
        { name: 'department', label: 'Department' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
        },
      ]}
      defaults={{
        avatarUrl: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        roleSlug: 'admin',
        department: '',
        status: 'active',
      }}
      searchPlaceholder="Search admin users…"
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
