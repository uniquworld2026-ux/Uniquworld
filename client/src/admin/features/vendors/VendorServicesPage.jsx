import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const serviceHooks = createErpHooks('vendor-services')

export function VendorServicesPage() {
  const services = serviceHooks.useList()
  const createService = serviceHooks.useCreate()
  const updateService = serviceHooks.useUpdate()
  const removeService = serviceHooks.useRemove()

  return (
    <AdminCrudPage
      title="Service Management"
      description="Priced service catalogue linked to vendors."
      addLabel="Add service"
      data={services.data || []}
      isLoading={services.isLoading}
      createMutation={createService}
      updateMutation={updateService}
      deleteMutation={removeService}
      columns={[
        { accessorKey: 'name', header: 'Service', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
        { accessorKey: 'vendorName', header: 'Vendor', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'category', header: 'Category', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        {
          accessorKey: 'unitPrice',
          header: 'Price',
          cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
        },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[
        { name: 'name', label: 'Service name', required: true },
        { name: 'vendorName', label: 'Vendor name', required: true },
        { name: 'category', label: 'Category' },
        { name: 'unitPrice', label: 'Unit price', type: 'number' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ],
        },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      defaults={{
        name: '',
        vendorName: '',
        category: '',
        unitPrice: 0,
        status: 'active',
        description: '',
      }}
      searchPlaceholder="Search services…"
    />
  )
}
