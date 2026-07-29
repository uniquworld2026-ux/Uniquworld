import { cn } from '@/shared/utils/cn'

/**
 * @param {{ className?: string }} props
 */
export function Skeleton({ className }) {
  return (
    <div
      className={cn('animate-pulse rounded-hm-md bg-hm-muted', className)}
      aria-hidden
    />
  )
}
