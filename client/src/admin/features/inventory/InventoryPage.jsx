import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const inventoryHooks = createErpHooks('inventory')

export function InventoryPage() {
  const inventory = inventoryHooks.useList()
  const createInv = inventoryHooks.useCreate()
  const updateInv = inventoryHooks.useUpdate()
  const removeInv = inventoryHooks.useRemove()

  return (
    <AdminCrudPage
      title="Inventory Management"
      description="Stock levels across warehouses for office fulfillment."
      addLabel="Add SKU"
      data={inventory.data || []}
      isLoading={inventory.isLoading}
      createMutation={createInv}
      updateMutation={updateInv}
      deleteMutation={removeInv}
      columns={[
        { accessorKey: 'sku', header: 'SKU', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
        { accessorKey: 'name', header: 'Item', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
        { accessorKey: 'warehouse', header: 'Warehouse', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'quantity', header: 'Qty', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'reserved', header: 'Reserved', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        {
          accessorKey: 'unitCost',
          header: 'Unit cost',
          cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
        },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[
        { name: 'sku', label: 'SKU', required: true },
        { name: 'name', label: 'Name', required: true },
        { name: 'warehouse', label: 'Warehouse' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
        { name: 'reserved', label: 'Reserved', type: 'number' },
        { name: 'reorderLevel', label: 'Reorder level', type: 'number' },
        { name: 'unitCost', label: 'Unit cost', type: 'number' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'in_stock', label: 'In stock' },
            { value: 'low', label: 'Low' },
            { value: 'out', label: 'Out of stock' },
          ],
        },
      ]}
      defaults={{
        sku: '',
        name: '',
        warehouse: 'Main',
        quantity: 0,
        reserved: 0,
        reorderLevel: 10,
        unitCost: 0,
        status: 'in_stock',
      }}
      searchPlaceholder="Search inventory…"
    />
  )
}
