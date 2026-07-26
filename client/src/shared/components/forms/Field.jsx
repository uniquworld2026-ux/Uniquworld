import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

export const Input = forwardRef(function Input(
  { className, label, error, hint, id, ...props },
  ref,
) {
  const inputId = id || props.name

  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-xs font-medium text-admin-text-muted">{label}</span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-10 w-full rounded-lg border border-admin-border bg-admin-elevated px-3 text-sm text-admin-text outline-none transition',
          'placeholder:text-admin-text-muted/70 focus:border-admin-accent focus:ring-2 focus:ring-admin-ring',
          error && 'border-admin-danger focus:border-admin-danger focus:ring-admin-danger/30',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-admin-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-admin-text-muted">{hint}</span> : null}
    </label>
  )
})

export const Textarea = forwardRef(function Textarea(
  { className, label, error, id, rows = 4, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-xs font-medium text-admin-text-muted">{label}</span>
      ) : null}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-admin-border bg-admin-elevated px-3 py-2 text-sm text-admin-text outline-none transition',
          'placeholder:text-admin-text-muted/70 focus:border-admin-accent focus:ring-2 focus:ring-admin-ring',
          error && 'border-admin-danger focus:border-admin-danger focus:ring-admin-danger/30',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-admin-danger">{error}</span> : null}
    </label>
  )
})

export const Select = forwardRef(function Select(
  { className, label, error, id, children, ...props },
  ref,
) {
  const inputId = id || props.name
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-xs font-medium text-admin-text-muted">{label}</span>
      ) : null}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          'h-10 w-full rounded-lg border border-admin-border bg-admin-elevated px-3 text-sm text-admin-text outline-none transition',
          'focus:border-admin-accent focus:ring-2 focus:ring-admin-ring',
          error && 'border-admin-danger',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-admin-danger">{error}</span> : null}
    </label>
  )
})

export function Checkbox({ label, className, ...props }) {
  return (
    <label className={cn('inline-flex items-center gap-2 text-sm text-admin-text', className)}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-admin-border text-admin-accent focus:ring-admin-ring"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}

/** Radio option — use inside a fieldset with a shared `name`. */
export const Radio = forwardRef(function Radio({ label, className, ...props }, ref) {
  return (
    <label className={cn('inline-flex cursor-pointer items-center gap-2 text-sm text-admin-text', className)}>
      <input
        ref={ref}
        type="radio"
        className="h-4 w-4 shrink-0 border-admin-border text-admin-accent accent-admin-accent focus:ring-admin-ring"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
})
