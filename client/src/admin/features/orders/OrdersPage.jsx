import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useErpCommerceOrders } from '@/admin/lib/createErpHooks'
import { erpApi } from '@/admin/lib/erpApi'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

export function OrdersPage() {
  const { data = [], isLoading } = useErpCommerceOrders()
  const qc = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      erpApi.updateOrderStatus(id, { status: data.status, note: data.notes }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'orders'] }),
  })

  const noop = useMutation({
    mutationFn: async () => {
      throw new Error('Orders are placed from the storefront checkout')
    },
  })

  const rows = data.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer: o.shippingAddress?.fullName || 'Customer',
    email: o.shippingAddress?.phone || '',
    total: o.totalAmount,
    items: (o.items || []).length,
    paymentStatus: o.payment?.status || 'pending',
    status: o.status,
    updatedAt: o.updatedAt,
    createdAt: o.createdAt,
  }))

  return (
    <AdminCrudPage
      title="Order Management"
      description="Live storefront orders — update fulfillment status here."
      addLabel="From checkout"
      data={rows}
      isLoading={isLoading}
      createMutation={noop}
      updateMutation={updateMutation}
      deleteMutation={noop}
      columns={[
        { accessorKey: 'orderNumber', header: 'Order', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
        { accessorKey: 'customer', header: 'Customer', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        {
          accessorKey: 'total',
          header: 'Total',
          cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
        },
        { accessorKey: 'items', header: 'Items', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        {
          accessorKey: 'paymentStatus',
          header: 'Payment',
          cell: ({ getValue }) => <StatusBadge value={getValue()} />,
        },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[
        {
          name: 'status',
          label: 'Order status',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'refunded', label: 'Refunded' },
          ],
        },
        { name: 'notes', label: 'Note', type: 'textarea' },
      ]}
      defaults={{ status: 'processing', notes: '' }}
      searchPlaceholder="Search orders…"
      statusFilter={{
        key: 'status',
        label: 'Status',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'processing', label: 'Processing' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      }}
    />
  )
}
