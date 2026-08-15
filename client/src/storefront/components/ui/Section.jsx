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
        'relative py-8 sm:py-14 md:py-20',
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
