import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export const BRAND_LOGO_SRC = '/brand/Uniquworld.jpg'

/**
 * Uniquworld wordmark logo for storefront chrome.
 * @param {{ className?: string, imgClassName?: string, to?: string | null, priority?: boolean }} props
 */
export function BrandLogo({ className, imgClassName, to = '/', priority = false }) {
  const image = (
    <img
      src={BRAND_LOGO_SRC}
      alt="Uniquworld"
      width={220}
      height={64}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' } : { loading: 'lazy' })}
      className={cn('h-9 w-auto object-contain object-left sm:h-11', imgClassName)}
    />
  )

  if (to === null) {
    return <span className={cn('inline-flex items-center', className)}>{image}</span>
  }

  return (
    <Link to={to} className={cn('inline-flex min-w-0 shrink-0 items-center', className)} aria-label="Uniquworld home">
      {image}
    </Link>
  )
}
