import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useErpShipments } from '@/admin/lib/createErpHooks'
import { erpApi } from '@/admin/lib/erpApi'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Button } from '@/shared/components/ui/Button'

export function ShippingPage() {
  const { data = [], isLoading } = useErpShipments()
  const qc = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => erpApi.updateShipment(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'shipments'] }),
  })

  const noop = useMutation({
    mutationFn: async () => {
      throw new Error('Shipments are created from paid orders')
    },
  })

  return (
    <AdminCrudPage
      title="Shipping & Delivery"
      description="Shiprocket AWBs, courier status, and delivery tracking."
      addLabel="Created with orders"
      data={data}
      isLoading={isLoading}
      createMutation={noop}
      updateMutation={updateMutation}
      deleteMutation={noop}
      columns={[
        { accessorKey: 'orderNumber', header: 'Order', cell: ({ getValue }) => <TextCell>{getValue()}</TextCell> },
        { accessorKey: 'carrier', header: 'Carrier', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'courierName', header: 'Courier', cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell> },
        { accessorKey: 'awbCode', header: 'AWB', cell: ({ getValue }) => <TextCell muted>{getValue() || 'Pending'}</TextCell> },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
        {
          id: 'track',
          header: '',
          cell: ({ row }) =>
            row.original.trackingUrl ? (
              <a href={row.original.trackingUrl} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline">Track</Button>
              </a>
            ) : null,
        },
      ]}
      fields={[
        {
          name: 'status',
          label: 'Shipment status',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'created', label: 'Created' },
            { value: 'picked_up', label: 'Picked up' },
            { value: 'in_transit', label: 'In transit' },
            { value: 'out_for_delivery', label: 'Out for delivery' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        },
        { name: 'awbCode', label: 'AWB code' },
        { name: 'courierName', label: 'Courier name' },
        { name: 'trackingUrl', label: 'Tracking URL' },
      ]}
      defaults={{
        status: 'pending',
        awbCode: '',
        courierName: '',
        trackingUrl: '',
      }}
      searchPlaceholder="Search shipments…"
    />
  )
}
