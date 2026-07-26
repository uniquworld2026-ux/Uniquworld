import { cn } from '@/shared/utils/cn'

export function Avatar({ name = 'User', src, size = 'md', className }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
  }

  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-admin-accent/20 font-medium text-admin-primary',
        sizes[size],
        className,
      )}
      aria-label={name}
    >
      {initials}
    </div>
  )
}
