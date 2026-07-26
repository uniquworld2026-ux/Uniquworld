import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const fulfillmentHooks = createErpHooks('fulfillment')

export function FulfillmentPage() {
  const fulfillment = fulfillmentHooks.useList()
  const createFf = fulfillmentHooks.useCreate()
  const updateFf = fulfillmentHooks.useUpdate()
  const removeFf = fulfillmentHooks.useRemove()

  return (
    <AdminCrudPage
      title="Office Fulfillment"
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
  )
}
