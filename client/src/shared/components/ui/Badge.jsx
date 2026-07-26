import { cn } from '@/shared/utils/cn'

export function Badge({ children, tone = 'default', className }) {
  const tones = {
    default: 'bg-admin-muted text-admin-text-muted',
    accent: 'bg-admin-sidebar-active-bg text-admin-accent',
    success: 'bg-admin-success/10 text-admin-success',
    warning: 'bg-admin-warning/10 text-admin-warning',
    danger: 'bg-admin-danger/10 text-admin-danger',
    info: 'bg-admin-info/10 text-admin-info',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
