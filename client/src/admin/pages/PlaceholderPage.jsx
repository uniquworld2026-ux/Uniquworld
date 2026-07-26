import { Clock, Construction, Layers, Route } from 'lucide-react'
import { AdminPageStats } from '@/admin/components/crud/AdminPageStats'

/**
 * Placeholder for admin modules not yet built.
 * @param {{ title: string }} props
 */
export function AdminPlaceholderPage({ title }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          This module will be built in a later step. Navigation and routing are already wired.
        </p>
      </div>

      <AdminPageStats
        stats={[
          { label: 'Status', value: 'Planned', hint: 'Coming next', tone: 'warning', icon: Construction },
          { label: 'Routes', value: 'Wired', hint: 'Sidebar + router ready', tone: 'success', icon: Route },
          { label: 'Data', value: '0', hint: 'No records yet', tone: 'default', icon: Layers },
          { label: 'ETA', value: 'Soon', hint: 'Next module pass', tone: 'accent', icon: Clock },
        ]}
      />

      <div className="rounded-2xl border border-dashed border-admin-border bg-admin-elevated p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-admin-accent">Coming next</p>
        <h3 className="mt-2 font-display text-3xl text-admin-text">{title}</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-admin-text-muted">
          Stats strip is ready; full CRUD for this module ships in a later pass.
        </p>
      </div>
    </div>
  )
}
