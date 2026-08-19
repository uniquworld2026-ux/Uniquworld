import { cn } from '@/shared/utils/cn'
import { customerFacingOrderStatus, statusLabel } from '@/storefront/lib/commerce'

const STYLES = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped: 'bg-violet-100 text-violet-800 border-violet-200',
  in_transit: 'bg-violet-100 text-violet-800 border-violet-200',
  out_for_delivery: 'bg-teal-100 text-teal-800 border-teal-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-hm-muted text-hm-text-muted border-hm-border',
}

export function OrderStatusBadge({ status, order, className }) {
  const key = String(
    order ? customerFacingOrderStatus(order) : status || '',
  ).toLowerCase()
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide sm:px-2.5 sm:text-[11px]',
        STYLES[key] || 'bg-hm-muted text-hm-text border-hm-border',
        className,
      )}
    >
      {statusLabel(key)}
    </span>
  )
}
