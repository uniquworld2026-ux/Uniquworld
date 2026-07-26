import { useErpCustomers } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'
import { Avatar } from '@/shared/components/ui/Avatar'
import { useMutation } from '@tanstack/react-query'

export function CustomersPage() {
  const { data = [], isLoading } = useErpCustomers()

  const noop = useMutation({
    mutationFn: async () => {
      throw new Error('Customers register from the storefront')
    },
  })

  return (
    <AdminCrudPage
      title="Customer Management"
      description="Registered storefront customers and spend summary."
      addLabel="From signup"
      data={data}
      isLoading={isLoading}
      createMutation={noop}
      updateMutation={noop}
      deleteMutation={noop}
      readOnly
      columns={[
        {
          accessorKey: 'name',
          header: 'Customer',
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <Avatar name={row.original.name || row.original.email} size="sm" />
              <div>
                <TextCell>{row.original.name || '—'}</TextCell>
                <p className="text-xs text-admin-text-muted">{row.original.email}</p>
              </div>
            </div>
          ),
        },
        { accessorKey: 'phone', header: 'Phone', cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell> },
        { accessorKey: 'orders', header: 'Orders', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        {
          accessorKey: 'totalSpent',
          header: 'Spent',
          cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
        },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[]}
      defaults={{}}
      searchPlaceholder="Search customers…"
    />
  )
}
