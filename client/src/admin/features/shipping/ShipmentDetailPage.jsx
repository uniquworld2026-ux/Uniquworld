import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Mail, RefreshCw, XCircle } from 'lucide-react'
import { erpApi } from '@/admin/lib/erpApi'
import { ShipmentTrackingPanel } from '@/admin/components/commerce/ShipmentTrackingPanel'
import { StatusBadge } from '@/admin/components/crud/AdminCrudPage'
import { Button } from '@/shared/components/ui/Button'
import { getErrorMessage } from '@/shared/lib/axios'

export function ShipmentDetailPage() {
  const { shipmentId } = useParams()
  const qc = useQueryClient()
  const [flash, setFlash] = useState('')

  const shipmentQuery = useQuery({
    queryKey: ['erp', 'commerce', 'shipments', shipmentId],
    queryFn: () => erpApi.getShipment(shipmentId),
    enabled: Boolean(shipmentId),
  })

  const cancelMutation = useMutation({
    mutationFn: (reason) => erpApi.cancelShipment(shipmentId, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'shipments', shipmentId] })
      qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'shipments'] })
      setFlash('Shipment cancelled in Shiprocket and order updated')
    },
  })

  const emailMutation = useMutation({
    mutationFn: () =>
      erpApi.sendOrderEmail(shipmentQuery.data.orderId, {
        type: 'status',
        message: `Your shipment AWB ${shipmentQuery.data.awbCode || ''} status: ${shipmentQuery.data.status}. Track from your account.`,
      }),
    onSuccess: () => setFlash('Tracking email sent to customer'),
  })

  const item = shipmentQuery.data
  const order = item?.order

  if (shipmentQuery.isLoading) {
    return <p className="p-8 text-sm text-admin-text-muted">Loading shipment…</p>
  }

  if (!item) {
    return (
      <div className="p-8 text-center">
        <p className="text-admin-text-muted">Shipment not found.</p>
        <Link to="/admin/shipping" className="mt-4 inline-block text-admin-accent hover:underline">
          Back to shipping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/admin/shipping"
            className="inline-flex items-center gap-1 text-sm text-admin-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Shipping
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-admin-text">
            Shipment · {item.orderNumber}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge value={item.status} />
            <StatusBadge value={item.deliveryMode === 'manual' ? 'manual' : 'auto'} />
          </div>
          <p className="mt-2 text-sm text-admin-text-muted">
            AWB {item.awbCode || 'Pending'} · {item.courierName || item.carrier}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => shipmentQuery.refetch()}>
            <RefreshCw className="h-4 w-4" />
            Refresh tracking
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={emailMutation.isPending}
            onClick={() => emailMutation.mutate()}
          >
            <Mail className="h-4 w-4" />
            Email customer
          </Button>
          {item.status !== 'cancelled' ? (
            <Button
              size="sm"
              variant="outline"
              disabled={cancelMutation.isPending}
              onClick={() => cancelMutation.mutate('Cancelled by admin from shipping panel')}
            >
              <XCircle className="h-4 w-4" />
              Cancel delivery
            </Button>
          ) : null}
          {item.orderId ? (
            <Link to={`/admin/orders/${item.orderId}`}>
              <Button size="sm" variant="accent">
                View order & invoice
              </Button>
            </Link>
          ) : null}
        </div>
      </div>

      {flash ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {flash}
        </p>
      ) : null}
      {(cancelMutation.error || emailMutation.error) && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {getErrorMessage(cancelMutation.error || emailMutation.error)}
        </p>
      )}

      <ShipmentTrackingPanel
        orderStatus={order?.status || item.orderStatus}
        timeline={order?.timeline || []}
        shipment={item}
        tracking={item.tracking}
        mapQuery={item.mapQuery}
      />
    </div>
  )
}
