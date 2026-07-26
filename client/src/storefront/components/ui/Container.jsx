import { cn } from '@/shared/utils/cn'

export function Container({ as: Comp = 'div', className, children, ...props }) {
  return (
    <Comp className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8', className)} {...props}>
      {children}
    </Comp>
  )
}
