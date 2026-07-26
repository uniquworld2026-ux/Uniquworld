import { cn } from '@/shared/utils/cn'

export function Section({
  as: Comp = 'section',
  className,
  muted = false,
  bordered = false,
  children,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'relative py-14 sm:py-16 md:py-20',
        muted && 'bg-hm-muted/40',
        bordered && 'border-y border-hm-border',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
