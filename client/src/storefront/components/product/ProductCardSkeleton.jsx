import { Skeleton } from '@/shared/components/ui/Skeleton'
import { cn } from '@/shared/utils/cn'

/** Skeleton placeholder matching ProductCard layout. */
export function ProductCardSkeleton({ className }) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated shadow-hm-soft',
        className,
      )}
      aria-hidden
    >
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-3/5 rounded-md" />
        <div className="mt-auto space-y-2 pt-3">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
          <div className="grid grid-cols-2 gap-1.5 pt-1 sm:gap-2.5">
            <Skeleton className="h-10 rounded-xl sm:h-11" />
            <Skeleton className="h-10 rounded-xl sm:h-11" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * @param {{ count?: number, className?: string }} props
 */
export function ProductGridSkeleton({ count = 8, className }) {
  return (
    <div
      className={cn(
        'grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4',
        className,
      )}
      role="status"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} className="h-full" />
      ))}
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated"
      aria-hidden
    >
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2 p-4 sm:p-5">
        <Skeleton className="h-7 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    </div>
  )
}
