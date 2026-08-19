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
        'group block rounded-2xl border border-hm-border bg-hm-elevated p-3.5 transition hover:border-hm-accent/40 hover:shadow-hm-soft sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="truncate font-sans text-xs font-semibold text-hm-text sm:text-sm">{order.orderNumber}</p>
          <p className="mt-0.5 font-sans text-[10px] text-hm-text-muted sm:mt-1 sm:text-xs">
            {formatDate(order.createdAt)} · {items.length} item{items.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <OrderStatusBadge status={order.status} />
          <ChevronRight className="h-3.5 w-3.5 text-hm-text-subtle transition group-hover:translate-x-0.5 group-hover:text-hm-accent sm:h-4 sm:w-4" />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5 sm:mt-4 sm:gap-3">
        <div className="flex shrink-0 -space-x-2">
          {thumbs.map((item) =>
            item.imageUrl ? (
              <img
                key={item.id}
                src={item.imageUrl}
                alt=""
                className="h-10 w-10 rounded-lg border-2 border-hm-elevated object-cover sm:h-12 sm:w-12 sm:rounded-xl"
              />
            ) : (
              <div
                key={item.id}
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-hm-elevated bg-hm-muted text-[9px] text-hm-text-subtle sm:h-12 sm:w-12 sm:rounded-xl sm:text-[10px]"
              >
                Gift
              </div>
            ),
          )}
          {extra > 0 ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-hm-elevated bg-hm-muted font-sans text-[10px] font-semibold text-hm-text-muted sm:h-12 sm:w-12 sm:rounded-xl sm:text-xs">
              +{extra}
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 font-sans text-[11px] text-hm-text-muted sm:line-clamp-2 sm:text-sm">
            {items.map((i) => i.productName).join(', ')}
          </p>
          <p className="mt-0.5 font-sans text-xs font-bold text-hm-primary sm:hidden">
            {formatINR(order.totalAmount)}
          </p>
        </div>
        <p className="hidden shrink-0 font-sans text-base font-bold text-hm-primary sm:block">{formatINR(order.totalAmount)}</p>
      </div>
    </Link>
  )
}
