import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const hooks = createErpHooks('stores')

export function StoresPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Store Management"
      description="Retail / wholesale store locations that sell the separate store catalog."
      addLabel="Add store"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={[
        { accessorKey: 'name', header: 'Store', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
        { accessorKey: 'code', header: 'Code', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'type', header: 'Type', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'city', header: 'City', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'managerName', header: 'Manager', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[
        { name: 'name', label: 'Store name', required: true },
        { name: 'code', label: 'Code' },
        {
          name: 'type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'retail', label: 'Retail' },
            { value: 'wholesale', label: 'Wholesale' },
            { value: 'flagship', label: 'Flagship' },
            { value: 'pop_up', label: 'Pop-up' },
          ],
        },
        { name: 'city', label: 'City' },
        { name: 'state', label: 'State' },
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'managerName', label: 'Manager' },
        { name: 'phone', label: 'Phone' },
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
        code: '',
        type: 'retail',
        city: '',
        state: '',
        address: '',
        managerName: '',
        phone: '',
        status: 'active',
      }}
      searchPlaceholder="Search stores…"
    />
  )
}
