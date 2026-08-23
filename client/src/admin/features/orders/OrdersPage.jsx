import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { useErpCommerceOrders } from '@/admin/lib/createErpHooks'
import { erpApi } from '@/admin/lib/erpApi'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Button } from '@/shared/components/ui/Button'
import { formatCurrency } from '@/shared/lib/utils'
import { displayPaymentStatus } from '@/storefront/lib/commerce'

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
    customer: o.customerName || o.shippingAddress?.fullName || 'Customer',
    email: o.customerEmail || o.shippingAddress?.email || '',
    phone: o.customerPhone || o.shippingAddress?.phone || '',
    total: o.totalAmount,
    items: (o.items || []).length,
    paymentStatus: displayPaymentStatus(o),
    status: o.status,
    updatedAt: o.updatedAt,
    createdAt: o.createdAt,
  }))

  return (
    <AdminCrudPage
      title="Order Management"
      description="Storefront orders with billing invoices — open any order and use the Invoice tab for With GST / Without GST documents, or create manual invoices from Invoice Generator."
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
          accessorKey: 'email',
          header: 'Email',
          cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
        },
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
        {
          id: 'view',
          header: '',
          cell: ({ row }) => (
            <Link to={`/admin/orders/${row.original.id}`}>
              <Button size="sm" variant="outline">
                <Eye className="h-3.5 w-3.5" />
                View
              </Button>
            </Link>
          ),
        },
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
            { value: 'failed', label: 'Failed' },
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
          { value: 'failed', label: 'Failed' },
        ],
      }}
    />
  )
}
