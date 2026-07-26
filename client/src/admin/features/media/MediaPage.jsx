import { useMemo, useState } from 'react'
import { ImagePlus, Search, Trash2 } from 'lucide-react'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { Input, Select } from '@/shared/components/forms/Field'
import { Badge } from '@/shared/components/ui/Badge'
import { AdminPageStats, buildPageStats } from '@/admin/components/crud/AdminPageStats'

const hooks = createErpHooks('media')

export function MediaPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const deleteMutation = hooks.useRemove()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', url: '', type: 'image', sizeKb: 120 })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (m) =>
        String(m.name || '')
          .toLowerCase()
          .includes(q) ||
        String(m.url || '')
          .toLowerCase()
          .includes(q),
    )
  }, [data, query])

  const pageStats = useMemo(() => {
    const totalKb = data.reduce((sum, m) => sum + (Number(m.sizeKb) || 0), 0)
    const base = buildPageStats(
      data.map((m) => ({ ...m, status: m.type || 'image' })),
      {
        entityLabel: 'Assets',
        statusOptions: [
          { value: 'image', label: 'Images' },
          { value: 'video', label: 'Videos' },
          { value: 'file', label: 'Files' },
        ],
      },
    )
    return [
      ...base.slice(0, 3),
      {
        label: 'Library size',
        value: `${Math.round(totalKb)} KB`,
        hint: 'Sum of asset sizes',
        tone: 'accent',
      },
    ]
  }, [data])

  async function handleCreate(e) {
    e.preventDefault()
    await createMutation.mutateAsync({
      ...form,
      sizeKb: Number(form.sizeKb) || 0,
    })
    setOpen(false)
    setForm({ name: '', url: '', type: 'image', sizeKb: 120 })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
            Media Library
          </h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            Store and reuse product imagery across the catalog.
          </p>
        </div>
        <Button variant="accent" size="sm" onClick={() => setOpen(true)}>
          <ImagePlus className="h-4 w-4" />
          Add Media
        </Button>
      </div>

      <AdminPageStats stats={pageStats} />

      <div className="rounded-2xl border border-admin-border bg-admin-elevated p-4 shadow-admin">
        <label className="relative block">
          <span className="sr-only">Search media</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search media…"
            className="h-10 w-full rounded-lg border border-admin-border bg-admin-bg pl-10 pr-3 text-sm outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-ring"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-admin-border bg-admin-elevated shadow-admin"
            >
              <div className="aspect-[4/3] bg-admin-muted">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-admin-text">{item.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone="info">{item.type}</Badge>
                    <span className="text-xs text-admin-text-muted">{item.sizeKb} KB</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  onClick={() => setDeleteTarget(item)}
                >
                  <Trash2 className="h-4 w-4 text-admin-danger" />
                </Button>
              </div>
            </article>
          ))}
          {filtered.length === 0 ? (
            <p className="col-span-full py-16 text-center text-sm text-admin-text-muted">
              No media found.
            </p>
          ) : null}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add media">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="URL"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            required
          />
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </Select>
          <Input
            label="Size (KB)"
            type="number"
            value={form.sizeKb}
            onChange={(e) => setForm((f) => ({ ...f, sizeKb: e.target.value }))}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={createMutation.isPending}>
              Add
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete media?"
      >
        <p className="text-sm text-admin-text-muted">
          Remove <span className="font-medium text-admin-text">{deleteTarget?.name}</span> from
          the library.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deleteMutation.isPending}
            onClick={async () => {
              await deleteMutation.mutateAsync(deleteTarget.id)
              setDeleteTarget(null)
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
