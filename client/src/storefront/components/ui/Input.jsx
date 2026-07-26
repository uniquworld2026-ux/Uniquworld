import { forwardRef } from 'react'
import { cn } from '@/shared/utils/cn'

const base =
  'w-full rounded-xl border border-hm-border bg-hm-bg px-4 text-sm text-hm-text outline-none transition placeholder:text-hm-text-subtle focus:border-hm-accent focus:ring-2 focus:ring-hm-ring disabled:opacity-50'

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(base, 'h-11', className)} {...props} />
})

export const TextArea = forwardRef(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(base, 'min-h-[120px] py-3 resize-y', className)}
      {...props}
    />
  )
})

export const Select = forwardRef(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn(base, 'h-11', className)} {...props}>
      {children}
    </select>
  )
})
