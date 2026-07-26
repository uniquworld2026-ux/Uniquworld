import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

const variants = {
  primary:
    'bg-hm-primary text-hm-bg-elevated hover:bg-hm-primary-hover shadow-hm-soft',
  secondary:
    'bg-hm-bg-muted text-hm-text hover:bg-hm-border border border-hm-border',
  accent:
    'bg-hm-accent text-hm-bg hover:opacity-90 shadow-hm-soft',
  ghost:
    'bg-transparent text-hm-text-muted hover:bg-hm-bg-muted hover:text-hm-text',
  outline:
    'bg-transparent border border-hm-border-strong text-hm-text hover:bg-hm-bg-muted',
  danger:
    'bg-hm-danger text-white hover:opacity-90',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-hm-md',
  md: 'h-11 px-5 text-sm gap-2 rounded-hm-md',
  lg: 'h-12 px-6 text-base gap-2 rounded-hm-lg',
  icon: 'h-10 w-10 rounded-hm-md justify-center p-0',
}

/**
 * Shared Button — uses Uniquworld brand tokens (works in storefront + admin).
 */
export const Button = forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    type = 'button',
    disabled,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
