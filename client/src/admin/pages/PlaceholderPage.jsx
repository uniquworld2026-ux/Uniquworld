/**
 * Placeholder for admin modules not yet built.
 * @param {{ title: string }} props
 */
export function AdminPlaceholderPage({ title }) {
  return (
    <div className="rounded-2xl border border-dashed border-admin-border bg-admin-elevated p-10 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-admin-accent">Coming next</p>
      <h2 className="mt-2 font-display text-3xl text-admin-text">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-admin-text-muted">
        This module will be built in a later step. Navigation and routing are already wired.
      </p>
    </div>
  )
}
