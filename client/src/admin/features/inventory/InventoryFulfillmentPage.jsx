import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

const inventoryHooks = createErpHooks('inventory')
const fulfillmentHooks = createErpHooks('fulfillment')

export function InventoryPage() {
  const inventory = inventoryHooks.useList()
  const fulfillment = fulfillmentHooks.useList()
  const createInv = inventoryHooks.useCreate()
  const updateInv = inventoryHooks.useUpdate()
  const removeInv = inventoryHooks.useRemove()
  const createFf = fulfillmentHooks.useCreate()
  const updateFf = fulfillmentHooks.useUpdate()
  const removeFf = fulfillmentHooks.useRemove()

  return (
    <div className="space-y-10">
      <AdminCrudPage
        title="Inventory"
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

      <AdminCrudPage
        title="Office fulfillment"
        description="Pick / pack tasks for orders moving through the warehouse."
        addLabel="New task"
        data={fulfillment.data || []}
        isLoading={fulfillment.isLoading}
        createMutation={createFf}
        updateMutation={updateFf}
        deleteMutation={removeFf}
        columns={[
          { accessorKey: 'taskNumber', header: 'Task', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
          { accessorKey: 'orderRef', header: 'Order', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'assignee', header: 'Assignee', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'priority', header: 'Priority', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
          { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
        ]}
        fields={[
          { name: 'taskNumber', label: 'Task number', required: true },
          { name: 'orderRef', label: 'Order reference' },
          { name: 'warehouse', label: 'Warehouse' },
          { name: 'assignee', label: 'Assignee' },
          {
            name: 'priority',
            label: 'Priority',
            type: 'select',
            options: [
              { value: 'low', label: 'Low' },
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High' },
            ],
          },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'pending', label: 'Pending' },
              { value: 'picking', label: 'Picking' },
              { value: 'packed', label: 'Packed' },
              { value: 'dispatched', label: 'Dispatched' },
            ],
          },
          { name: 'notes', label: 'Notes', type: 'textarea' },
        ]}
        defaults={{
          taskNumber: '',
          orderRef: '',
          warehouse: 'Main',
          assignee: '',
          status: 'pending',
          priority: 'normal',
          notes: '',
        }}
        searchPlaceholder="Search tasks…"
      />
    </div>
  )
}
