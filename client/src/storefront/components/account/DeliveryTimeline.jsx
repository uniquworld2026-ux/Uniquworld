import { Check, Circle, Package, ShoppingBag, Truck } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { formatDate } from '@/storefront/lib/commerce'

const STEPS = [
  { id: 'pending', label: 'Order placed', icon: ShoppingBag },
  { id: 'confirmed', label: 'Confirmed', icon: Check },
  { id: 'processing', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Check },
]

const STATUS_RANK = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  in_transit: 3,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
}

function rankForStatus(status) {
  return STATUS_RANK[String(status || '').toLowerCase()] ?? 0
}

function eventForStep(timeline, stepId) {
  return (timeline || []).find((e) => String(e.status).toLowerCase() === stepId)
}

/** Visual delivery timeline for order tracking. */
export function DeliveryTimeline({ status, timeline = [], estimatedDelivery, className }) {
  const currentRank = rankForStatus(status)
  const cancelled = String(status).toLowerCase() === 'cancelled'

  if (cancelled) {
    return (
      <div className={cn('rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5', className)}>
        <p className="text-xs font-semibold text-red-800 sm:text-sm">Order cancelled</p>
        <p className="mt-1 text-xs text-red-700/80 sm:text-sm">
          {timeline?.[timeline.length - 1]?.note || 'This order was cancelled.'}
        </p>
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl border border-hm-border bg-hm-elevated p-4 sm:p-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <h3 className="font-sans text-xs font-semibold text-hm-text sm:text-sm">Delivery timeline</h3>
        {estimatedDelivery ? (
          <p className="text-[10px] text-hm-text-muted sm:text-xs">
            Est. <span className="font-medium text-hm-text">{formatDate(estimatedDelivery)}</span>
          </p>
        ) : null}
      </div>

      <ol className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-6 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
        {STEPS.map((step, index) => {
          const done = currentRank >= index
          const active = currentRank === index
          const event = eventForStep(timeline, step.id)
          const Icon = step.icon

          return (
            <li key={step.id} className="relative flex w-20 shrink-0 flex-col items-center text-center sm:w-auto">
              {index < STEPS.length - 1 ? (
                <span
                  className={cn(
                    'absolute left-[calc(50%+1.25rem)] top-5 hidden h-0.5 w-[calc(100%-2.5rem)] sm:block',
                    done && index < currentRank ? 'bg-hm-accent' : 'bg-hm-border',
                  )}
                  aria-hidden
                />
              ) : null}
              <span
                className={cn(
                  'relative z-[1] flex h-10 w-10 items-center justify-center rounded-full border-2 transition',
                  done
                    ? 'border-hm-accent bg-hm-accent text-white'
                    : active
                      ? 'border-hm-accent bg-hm-accent-muted text-hm-accent'
                      : 'border-hm-border bg-hm-bg text-hm-text-subtle',
                )}
              >
                {done && !active ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </span>
              <p
                className={cn(
                  'mt-2 text-xs font-semibold',
                  done || active ? 'text-hm-text' : 'text-hm-text-subtle',
                )}
              >
                {step.label}
              </p>
              {event?.createdAt ? (
                <p className="mt-0.5 text-[10px] text-hm-text-muted">{formatDate(event.createdAt)}</p>
              ) : active ? (
                <p className="mt-0.5 text-[10px] font-medium text-hm-accent">In progress</p>
              ) : (
                <p className="mt-0.5 text-[10px] text-hm-text-subtle">
                  <Circle className="mx-auto h-1 w-1 fill-current" />
                </p>
              )}
            </li>
          )
        })}
      </ol>

      {(timeline || []).length > 0 ? (
        <div className="mt-4 border-t border-hm-border pt-3 sm:mt-6 sm:pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-hm-text-subtle sm:text-xs">Updates</p>
          <ul className="mt-2 space-y-2.5 sm:mt-3 sm:space-y-3">
            {[...(timeline || [])].reverse().slice(0, 5).map((event, idx) => (
              <li key={`${event.status}-${idx}`} className="flex gap-2.5 text-xs sm:gap-3 sm:text-sm">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-hm-accent" />
                <div>
                  <p className="font-medium text-hm-text capitalize">{String(event.status).replace(/_/g, ' ')}</p>
                  {event.note ? <p className="text-hm-text-muted">{event.note}</p> : null}
                  <p className="text-xs text-hm-text-subtle">{formatDate(event.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
