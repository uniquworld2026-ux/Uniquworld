import { formatINR } from '@/storefront/lib/commerce'
import { ORDER_PRICING } from '@/storefront/lib/orderPricing'
import { cn } from '@/shared/utils/cn'

/** Flipkart / Amazon / Meesho style billing breakdown */
export function BillingSummary({
  subtotal,
  platformFeeAmount,
  shippingAmount,
  totalAmount,
  className,
  compact = false,
}) {
  const shippingLabel =
    shippingAmount === 0
      ? 'FREE'
      : formatINR(shippingAmount)

  return (
    <div className={cn('space-y-2 font-sans text-sm', className)}>
      <div className="flex items-center justify-between gap-3 text-hm-text-muted">
        <span>Product total</span>
        <span className="font-medium text-hm-text">{formatINR(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-hm-text-muted">
        <span>Platform fee</span>
        <span className="font-medium text-hm-text">{formatINR(platformFeeAmount)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-hm-text-muted">
        <span>Delivery charges</span>
        <span
          className={cn(
            'font-medium',
            shippingAmount === 0 ? 'text-hm-success' : 'text-hm-text',
          )}
        >
          {shippingLabel}
        </span>
      </div>
      {!compact && subtotal > 0 && subtotal < ORDER_PRICING.freeShippingMin ? (
        <p className="text-xs text-hm-text-subtle">
          Free delivery on orders above {formatINR(ORDER_PRICING.freeShippingMin)}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3 border-t border-hm-border pt-3 text-base font-semibold text-hm-text">
        <span>Total amount</span>
        <span className="text-hm-primary">{formatINR(totalAmount)}</span>
      </div>
    </div>
  )
}
