import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { useErpShipments } from '@/admin/lib/createErpHooks'
import { erpApi } from '@/admin/lib/erpApi'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Button } from '@/shared/components/ui/Button'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'created', label: 'Created' },
  { value: 'picked_up', label: 'Picked up' },
  { value: 'in_transit', label: 'In transit' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rto', label: 'RTO' },
  { value: 'failed', label: 'Failed' },
]

/**
 * Shipping & Delivery — support manual entry OR auto (Shiprocket) create/update via API.
 */
export function ShippingPage() {
  const { data = [], isLoading } = useErpShipments()
  const qc = useQueryClient()

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'shipments'] })

  const createMutation = useMutation({
    mutationFn: (payload) => {
      const body = {
        orderNumber: String(payload.orderNumber || '').trim(),
        deliveryMode: payload.deliveryMode || 'manual',
        carrier: payload.carrier || (payload.deliveryMode === 'auto' ? 'shiprocket' : 'manual'),
        courierName: payload.courierName || '',
        awbCode: payload.awbCode || '',
        trackingUrl: payload.trackingUrl || '',
        status: payload.status || 'created',
        estimatedDelivery: payload.estimatedDelivery || null,
        notes: payload.notes || '',
      }
      if (!body.orderNumber) {
        return Promise.reject(new Error('Order number is required'))
      }
      return erpApi.createShipment(body)
    },
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      erpApi.updateShipment(id, {
        deliveryMode: data.deliveryMode,
        carrier: data.carrier,
        courierName: data.courierName,
        awbCode: data.awbCode,
        trackingUrl: data.trackingUrl,
        status: data.status,
        estimatedDelivery: data.estimatedDelivery || null,
        notes: data.notes || '',
      }),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => erpApi.deleteShipment(id),
    onSuccess: invalidate,
  })

  const rows = data.map((s) => ({
    ...s,
    status: s.status || s.shipmentStatus,
    deliveryMode: s.deliveryMode || (s.carrier === 'manual' ? 'manual' : 'auto'),
    notes: s.metadata?.notes || '',
    estimatedDelivery: s.estimatedDelivery
      ? String(s.estimatedDelivery).slice(0, 10)
      : '',
  }))

  return (
    <AdminCrudPage
      title="Shipping and Delivery Management"
      description="Create manual deliveries when needed, or use auto Shiprocket shipment. Updates sync via API."
      addLabel="Add delivery"
      data={rows}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      getRowLabel={(row) => row.orderNumber || row.awbCode || row.id}
      columns={[
        {
          accessorKey: 'orderNumber',
          header: 'Order',
          cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
        },
        {
          accessorKey: 'deliveryMode',
          header: 'Mode',
          cell: ({ getValue }) => (
            <StatusBadge value={getValue() === 'manual' ? 'manual' : 'auto'} />
          ),
        },
        {
          accessorKey: 'carrier',
          header: 'Carrier',
          cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
        },
        {
          accessorKey: 'courierName',
          header: 'Courier',
          cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
        },
        {
          accessorKey: 'awbCode',
          header: 'AWB',
          cell: ({ getValue }) => <TextCell muted>{getValue() || 'Pending'}</TextCell>,
        },
        {
          accessorKey: 'status',
          header: 'Status',
          cell: ({ getValue }) => <StatusBadge value={getValue()} />,
        },
        {
          id: 'track',
          header: '',
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <Link to={`/admin/shipping/${row.original.id}`}>
                <Button size="sm" variant="outline">
                  <Eye className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </Link>
              {row.original.trackingUrl ? (
                <a href={row.original.trackingUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="ghost">
                    Track
                  </Button>
                </a>
              ) : null}
            </div>
          ),
        },
      ]}
      fields={[
        {
          name: 'orderNumber',
          label: 'Order number',
          required: true,
          placeholder: 'e.g. UW-1001',
        },
        {
          name: 'deliveryMode',
          label: 'Delivery mode',
          type: 'select',
          options: [
            { value: 'manual', label: 'Manual delivery (enter courier / AWB)' },
            { value: 'auto', label: 'Auto (Shiprocket / system)' },
          ],
        },
        {
          name: 'carrier',
          label: 'Carrier',
          type: 'select',
          options: [
            { value: 'manual', label: 'Manual / local' },
            { value: 'shiprocket', label: 'Shiprocket' },
            { value: 'delhivery', label: 'Delhivery' },
            { value: 'bluedart', label: 'Blue Dart' },
            { value: 'other', label: 'Other' },
          ],
        },
        { name: 'courierName', label: 'Courier / rider name' },
        { name: 'awbCode', label: 'AWB / tracking code' },
        { name: 'trackingUrl', label: 'Tracking URL' },
        {
          name: 'status',
          label: 'Shipment status',
          type: 'select',
          options: STATUS_OPTIONS,
        },
        { name: 'estimatedDelivery', label: 'Estimated delivery', type: 'date' },
        { name: 'notes', label: 'Notes', type: 'textarea' },
      ]}
      defaults={{
        orderNumber: '',
        deliveryMode: 'manual',
        carrier: 'manual',
        courierName: '',
        awbCode: '',
        trackingUrl: '',
        status: 'created',
        estimatedDelivery: '',
        notes: '',
      }}
      searchPlaceholder="Search shipments…"
      statusFilter={{
        key: 'status',
        label: 'Status',
        options: STATUS_OPTIONS,
      }}
    />
  )
}
