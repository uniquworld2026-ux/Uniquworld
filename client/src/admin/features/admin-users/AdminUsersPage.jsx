import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Avatar } from '@/shared/components/ui/Avatar'

const hooks = createErpHooks('admin-users')

export function AdminUsersPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Admin User Management"
      description="Internal ERP users — admins, ops, and warehouse staff."
      addLabel="Add admin user"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={[
        {
          accessorKey: 'name',
          header: 'User',
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <Avatar name={row.original.name} size="sm" />
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
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
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
        name: '',
        email: '',
        phone: '',
        roleSlug: 'admin',
        department: '',
        status: 'active',
      }}
      searchPlaceholder="Search admin users…"
    />
  )
}
