import { motion } from 'framer-motion'
import {
  Activity,
  CheckCircle2,
  CircleDashed,
  Layers,
  PauseCircle,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const DEFAULT_ICONS = [Layers, CheckCircle2, CircleDashed, Activity]

/**
 * @typedef {{ label: string, value: string | number, hint?: string, tone?: 'default' | 'success' | 'warning' | 'danger' | 'accent', icon?: import('lucide-react').LucideIcon }} AdminStat
 */

/**
 * Build exactly 4 stats from a list of records (status-aware).
 * Layout: Total · Status A · Status B · Updated (7d)
 */
export function buildPageStats(data = [], opts = {}) {
  const rows = Array.isArray(data) ? data : []
  const statusKey = opts.statusKey || 'status'
  const entity = opts.entityLabel || 'Records'
  const counts = Object.create(null)

  rows.forEach((row) => {
    const key = String(row?.[statusKey] ?? 'unknown')
    counts[key] = (counts[key] || 0) + 1
  })

  const now = Date.now()
  const weekMs = 7 * 24 * 60 * 60 * 1000
  const recent = rows.filter((row) => {
    const raw = row?.updatedAt || row?.createdAt
    if (!raw) return false
    const t = new Date(raw).getTime()
    return Number.isFinite(t) && now - t <= weekMs
  }).length

  const optionList =
    Array.isArray(opts.statusOptions) && opts.statusOptions.length
      ? opts.statusOptions
      : Object.keys(counts)
          .sort((a, b) => counts[b] - counts[a])
          .map((value) => ({
            value,
            label: value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          }))

  const preferred = [
    'active',
    'published',
    'confirmed',
    'paid',
    'delivered',
    'in_stock',
    'processing',
    'shipped',
    'draft',
    'pending',
    'inactive',
    'cancelled',
    'archived',
    'low',
    'out',
  ]

  const picked = []
  for (const key of preferred) {
    const opt = optionList.find((o) => o.value === key)
    if (opt && !picked.find((p) => p.value === opt.value)) picked.push(opt)
    if (picked.length >= 2) break
  }
  for (const opt of optionList) {
    if (picked.length >= 2) break
    if (!picked.find((p) => p.value === opt.value)) picked.push(opt)
  }

  const toneFor = (value) => {
    if (['active', 'published', 'delivered', 'paid', 'confirmed', 'in_stock', 'success'].includes(value)) {
      return 'success'
    }
    if (['draft', 'pending', 'low', 'processing', 'warning', 'archived'].includes(value)) {
      return 'warning'
    }
    if (['inactive', 'cancelled', 'out', 'failed', 'rto', 'danger'].includes(value)) {
      return 'danger'
    }
    return 'default'
  }

  while (picked.length < 2) {
    picked.push({ value: `empty_${picked.length}`, label: `Status ${picked.length + 1}` })
  }

  return [
    {
      label: `Total ${entity}`,
      value: rows.length,
      hint: 'All records',
      tone: 'accent',
      icon: Layers,
    },
    {
      label: picked[0].label,
      value: counts[picked[0].value] || 0,
      hint: `Status · ${picked[0].value.startsWith('empty_') ? '—' : picked[0].value}`,
      tone: toneFor(picked[0].value),
      icon: toneFor(picked[0].value) === 'success' ? CheckCircle2 : CircleDashed,
    },
    {
      label: picked[1].label,
      value: counts[picked[1].value] || 0,
      hint: `Status · ${picked[1].value.startsWith('empty_') ? '—' : picked[1].value}`,
      tone: toneFor(picked[1].value),
      icon: toneFor(picked[1].value) === 'success' ? CheckCircle2 : PauseCircle,
    },
    {
      label: 'Updated (7d)',
      value: recent,
      hint: 'Created or edited this week',
      tone: recent > 0 ? 'accent' : 'default',
      icon: Activity,
    },
  ]
}

/**
 * Compact 4-stat strip — always a single horizontal row on md+.
 */
export function AdminPageStats({ stats = [], className }) {
  const padded =
    stats.length >= 4
      ? stats.slice(0, 4)
      : [
          ...stats,
          ...Array.from({ length: Math.max(0, 4 - stats.length) }, (_, i) => ({
            label: `Metric ${stats.length + i + 1}`,
            value: '—',
            hint: 'Pending data',
            tone: 'default',
            icon: DEFAULT_ICONS[(stats.length + i) % DEFAULT_ICONS.length],
          })),
        ]

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-4',
        className,
      )}
    >
      {padded.map((item, index) => {
        const Icon = item.icon || DEFAULT_ICONS[index % DEFAULT_ICONS.length]
        const tone = item.tone || 'default'
        return (
          <motion.div
            key={`${item.label}-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.22 }}
            className="min-w-0 rounded-xl border border-admin-border bg-admin-elevated px-3 py-2.5 shadow-admin sm:px-3.5 sm:py-3"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-admin-text-muted">
                  {item.label}
                </p>
                <p className="mt-1 truncate text-lg font-semibold tracking-tight text-admin-text sm:text-xl">
                  {item.value}
                </p>
                {item.hint ? (
                  <p className="mt-0.5 truncate text-[10px] text-admin-text-muted sm:text-[11px]">
                    {item.hint}
                  </p>
                ) : null}
              </div>
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  tone === 'success' && 'bg-admin-success/10 text-admin-success',
                  tone === 'warning' && 'bg-admin-warning/10 text-admin-warning',
                  tone === 'danger' && 'bg-admin-danger/10 text-admin-danger',
                  tone === 'accent' && 'bg-admin-sidebar-active-bg text-admin-accent',
                  tone === 'default' && 'bg-admin-muted text-admin-text-muted',
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
