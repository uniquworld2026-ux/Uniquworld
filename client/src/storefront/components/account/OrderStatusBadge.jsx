import { cn } from '@/shared/utils/cn'
import { statusLabel } from '@/storefront/lib/commerce'

const STYLES = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-sky-100 text-sky-800 border-sky-200',
  processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped: 'bg-violet-100 text-violet-800 border-violet-200',
  in_transit: 'bg-violet-100 text-violet-800 border-violet-200',
  out_for_delivery: 'bg-teal-100 text-teal-800 border-teal-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  refunded: 'bg-hm-muted text-hm-text-muted border-hm-border',
}

export function OrderStatusBadge({ status, className }) {
  const key = String(status || '').toLowerCase()
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        STYLES[key] || 'bg-hm-muted text-hm-text border-hm-border',
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  )
}
