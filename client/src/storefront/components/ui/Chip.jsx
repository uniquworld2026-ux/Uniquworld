import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export function Chip({ as, to, active = false, className, children, ...props }) {
  const Comp = to ? Link : as || 'button'
  const linkProps = to ? { to } : { type: Comp === 'button' ? 'button' : undefined }

  return (
    <Comp
      {...linkProps}
      {...props}
      className={cn(
        'inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition',
        active
          ? 'border-hm-accent bg-hm-accent-muted text-hm-text'
          : 'border-hm-border bg-hm-bg text-hm-text hover:border-hm-accent',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
