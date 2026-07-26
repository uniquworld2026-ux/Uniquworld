import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const vendorHooks = createErpHooks('vendors')
const serviceHooks = createErpHooks('vendor-services')

export function VendorsPage() {
  const vendors = vendorHooks.useList()
  const services = serviceHooks.useList()
  const createVendor = vendorHooks.useCreate()
  const updateVendor = vendorHooks.useUpdate()
  const removeVendor = vendorHooks.useRemove()
  const createService = serviceHooks.useCreate()
  const updateService = serviceHooks.useUpdate()
  const removeService = serviceHooks.useRemove()

  return (
    <div className="space-y-10">
      <AdminCrudPage
        title="Vendors"
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

      <AdminCrudPage
        title="Vendor services"
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
    </div>
  )
}
