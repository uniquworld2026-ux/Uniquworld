import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const vendorHooks = createErpHooks('vendors')

export function VendorsPage() {
  const vendors = vendorHooks.useList()
  const createVendor = vendorHooks.useCreate()
  const updateVendor = vendorHooks.useUpdate()
  const removeVendor = vendorHooks.useRemove()

  return (
    <AdminCrudPage
      title="Vendor Management"
      description="Partner vendors for services, packaging, and logistics support."
      addLabel="Add vendor"
      data={vendors.data || []}
      isLoading={vendors.isLoading}
      createMutation={createVendor}
      updateMutation={updateVendor}
      deleteMutation={removeVendor}
      columns={[
        { accessorKey: 'name', header: 'Vendor', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
        { accessorKey: 'serviceType', header: 'Type', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'city', header: 'City', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'rating', header: 'Rating', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[
        { name: 'name', label: 'Vendor name', required: true },
        { name: 'code', label: 'Code' },
        { name: 'serviceType', label: 'Service type' },
        { name: 'contactName', label: 'Contact' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone' },
        { name: 'city', label: 'City' },
        { name: 'rating', label: 'Rating', type: 'number' },
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
      ]}
      defaults={{
        name: '',
        code: '',
        serviceType: '',
        contactName: '',
        email: '',
        phone: '',
        city: '',
        status: 'active',
        rating: 0,
        notes: '',
      }}
      searchPlaceholder="Search vendors…"
    />
  )
}
