import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { formatDate, formatINR } from '@/storefront/lib/commerce'
import { OrderStatusBadge } from '@/storefront/components/account/OrderStatusBadge'
import { cn } from '@/shared/utils/cn'

export function OrderCard({ order, className }) {
  const items = order.items || []
  const thumbs = items.slice(0, 3)
  const extra = items.length - thumbs.length

  return (
    <Link
      to={`/account/orders/${order.id}`}
      className={cn(
        'group block rounded-2xl border border-hm-border bg-hm-elevated p-4 transition hover:border-hm-accent/40 hover:shadow-hm-soft sm:p-5',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-sans text-sm font-semibold text-hm-text">{order.orderNumber}</p>
          <p className="mt-1 font-sans text-xs text-hm-text-muted">
            Placed {formatDate(order.createdAt)} · {items.length} item{items.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <ChevronRight className="h-4 w-4 text-hm-text-subtle transition group-hover:translate-x-0.5 group-hover:text-hm-accent" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {thumbs.map((item) =>
            item.imageUrl ? (
              <img
                key={item.id}
                src={item.imageUrl}
                alt=""
                className="h-12 w-12 rounded-xl border-2 border-hm-elevated object-cover"
              />
            ) : (
              <div
                key={item.id}
                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-hm-elevated bg-hm-muted text-[10px] text-hm-text-subtle"
              >
                Gift
              </div>
            ),
          )}
          {extra > 0 ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-hm-elevated bg-hm-muted font-sans text-xs font-semibold text-hm-text-muted">
              +{extra}
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-sans text-sm text-hm-text-muted">
            {items.map((i) => i.productName).join(', ')}
          </p>
        </div>
        <p className="shrink-0 font-sans text-base font-bold text-hm-primary">{formatINR(order.totalAmount)}</p>
      </div>
    </Link>
  )
}
