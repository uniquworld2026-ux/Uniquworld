import { cn } from '@/shared/utils/cn'

const MODES = [
  { id: 'with', label: 'With GST' },
  { id: 'without', label: 'Without GST' },
]

/** Toggle between GST and non-GST invoice formats. */
export function InvoiceGstTabs({ value = 'with', onChange, className }) {
  return (
    <div className={cn('inline-flex rounded-xl border border-admin-border bg-admin-muted p-1', className)}>
      {MODES.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange?.(mode.id)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition',
            value === mode.id
              ? 'bg-admin-accent text-white shadow-sm'
              : 'text-admin-text-muted hover:text-admin-text',
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
