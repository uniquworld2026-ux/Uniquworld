import { cn } from '@/shared/utils/cn'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  action,
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'mx-auto max-w-2xl text-center items-center',
        align === 'left' && 'max-w-2xl items-start text-left',
        align === 'between' &&
          'w-full flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn(align === 'between' && 'max-w-xl')}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 font-display text-3xl tracking-tight text-hm-text sm:text-4xl md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-hm-text-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
