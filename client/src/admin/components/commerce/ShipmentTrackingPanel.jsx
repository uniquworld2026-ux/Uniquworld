import { ExternalLink, MapPin, Package, Truck } from 'lucide-react'
import { DeliveryTimeline } from '@/storefront/components/account/DeliveryTimeline'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

function formatWhen(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

/** Admin shipment map + Shiprocket scan timeline + order timeline. */
export function ShipmentTrackingPanel({
  orderStatus,
  timeline = [],
  shipment,
  tracking,
  mapQuery,
  className,
}) {
  const activities = tracking?.activities || []
  const mapSrc = mapQuery
    ? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`
    : null

  return (
    <div className={cn('space-y-6', className)}>
      <DeliveryTimeline
        status={orderStatus}
        timeline={timeline}
        estimatedDelivery={shipment?.estimatedDelivery}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-admin-accent" />
            <h3 className="text-sm font-semibold text-admin-text">Delivery map</h3>
          </div>
          {mapSrc ? (
            <iframe
              title="Delivery location"
              src={mapSrc}
              className="h-56 w-full rounded-xl border border-admin-border bg-admin-muted"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <p className="text-sm text-admin-text-muted">No delivery address for map preview.</p>
          )}
          {mapQuery ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-admin-accent hover:underline"
            >
              Open in Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </section>

        <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5">
          <div className="mb-4 flex items-center gap-2">
            <Truck className="h-4 w-4 text-admin-accent" />
            <h3 className="text-sm font-semibold text-admin-text">Shiprocket live status</h3>
          </div>
          {shipment ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-admin-text-muted">Courier</dt>
                <dd className="font-medium text-admin-text">
                  {tracking?.courier || shipment.courierName || '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-admin-text-muted">AWB</dt>
                <dd className="font-medium text-admin-text">{shipment.awbCode || 'Pending'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-admin-text-muted">Live status</dt>
                <dd className="font-medium capitalize text-admin-text">
                  {tracking?.status || shipment.status || '—'}
                </dd>
              </div>
              {tracking?.etd ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-admin-text-muted">ETA</dt>
                  <dd className="font-medium text-admin-text">{formatWhen(tracking.etd)}</dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="text-sm text-admin-text-muted">No shipment created yet.</p>
          )}
          {shipment?.trackingUrl ? (
            <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block">
              <Button size="sm" variant="outline">
                Track on Shiprocket
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          ) : null}
        </section>
      </div>

      {activities.length ? (
        <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-admin-accent" />
            <h3 className="text-sm font-semibold text-admin-text">Courier scan timeline</h3>
          </div>
          <ol className="space-y-3">
            {activities.map((scan, idx) => (
              <li key={`${scan.timestamp}-${idx}`} className="flex gap-3 text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-admin-accent" />
                <div>
                  <p className="font-medium text-admin-text">{scan.status}</p>
                  {scan.location ? (
                    <p className="text-admin-text-muted">{scan.location}</p>
                  ) : null}
                  <p className="text-xs text-admin-text-muted">{formatWhen(scan.timestamp)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  )
}
