import { cn } from '@/shared/utils/cn'

export function GlassPanel({ as: Comp = 'div', className, strong = false, children, ...props }) {
  return (
    <Comp
      className={cn(strong ? 'glass-strong' : 'glass', 'rounded-2xl shadow-hm-soft', className)}
      {...props}
    >
      {children}
    </Comp>
  )
}
