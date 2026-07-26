import { Star } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

/**
 * Shows up to 5 gold star icons based on rating value.
 * @param {{ rating?: number, size?: 'sm' | 'md', className?: string, showValue?: boolean }} props
 */
export function StarRating({ rating = 0, size = 'sm', className, showValue = false }) {
  const value = Number(rating) || 0
  const filled = Math.max(0, Math.min(5, Math.round(value)))
  const iconClass = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'

  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < filled
        return (
          <Star
            key={index}
            className={cn(
              iconClass,
              isFilled ? 'fill-hm-gold text-hm-gold' : 'fill-transparent text-hm-border-strong',
            )}
          />
        )
      })}
      {showValue ? (
        <span className="ml-1 text-[0.8125rem] font-semibold text-hm-gold">{value}</span>
      ) : null}
    </span>
  )
}
