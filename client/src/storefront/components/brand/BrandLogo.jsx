import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export const BRAND_ICON_SRC = encodeURI('/brand/Uniquworld Logo Icon.png')
export const BRAND_LOGO_SRC = encodeURI('/brand/Uniquworld Primery  Logo.png')

/**
 * Uniquworld logo for storefront chrome.
 * @param {{ className?: string, imgClassName?: string, to?: string | null, priority?: boolean, variant?: 'primary' | 'icon' }} props
 */
export function BrandLogo({
  className,
  imgClassName,
  to = '/',
  priority = false,
  variant = 'primary',
}) {
  const isIcon = variant === 'icon'
  const image = (
    <img
      src={isIcon ? BRAND_ICON_SRC : BRAND_LOGO_SRC}
      alt="Uniquworld"
      width={isIcon ? 64 : 280}
      height={isIcon ? 64 : 72}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' } : { loading: 'lazy' })}
      className={cn(
        isIcon
          ? 'h-9 w-9 object-contain sm:h-10 sm:w-10'
          : 'h-9 w-auto object-contain object-left sm:h-11',
        imgClassName,
      )}
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
