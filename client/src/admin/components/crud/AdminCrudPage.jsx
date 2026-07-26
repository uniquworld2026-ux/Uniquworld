import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { Input, Select, Textarea, Checkbox } from '@/shared/components/forms/Field'
import { ImageUploadField } from '@/shared/components/forms/ImageUploadField'
import { statusTone } from '@/admin/lib/statusTone'
import { cn } from '@/shared/utils/cn'

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Generic admin CRUD list page with modal create/edit.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} props.addLabel
 * @param {object[]} props.data
 * @param {boolean} props.isLoading
 * @param {{ mutateAsync: Function, isPending?: boolean }} props.createMutation
 * @param {{ mutateAsync: Function, isPending?: boolean }} props.updateMutation
 * @param {{ mutateAsync: Function, isPending?: boolean }} props.deleteMutation
 * @param {object[]} props.columns - TanStack column defs (without actions)
 * @param {object[]} props.fields - form field configs
 * @param {object} props.defaults - form default values
 * @param {string} [props.searchPlaceholder]
 * @param {{ key: string, label: string, options: {value:string,label:string}[] } | null} [props.statusFilter]
 * @param {(row: object) => string} [props.getRowLabel]
 * @param {boolean} [props.readOnly]
 * @param {import('react').ReactNode} [props.headerActions]
 */
export function AdminCrudPage({
  title,
  description,
  addLabel = 'Add',
  data = [],
  isLoading,
  createMutation,
  updateMutation,
  deleteMutation,
  columns: columnDefs,
  fields,
  defaults,
  searchPlaceholder = 'Search…',
  statusFilter = null,
  getRowLabel = (row) => row.name || row.title || row.code || row.id,
  readOnly = false,
  headerActions = null,
}) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [filterValue, setFilterValue] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaults)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    if (!statusFilter || filterValue === 'all') return data
    return data.filter((row) => row[statusFilter.key] === filterValue)
  }, [data, filterValue, statusFilter])

  const columns = useMemo(() => {
    const cols = [...columnDefs]
    if (!readOnly) {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit"
              onClick={() => openEdit(row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete"
              onClick={() => setDeleteTarget(row.original)}
            >
              <Trash2 className="h-4 w-4 text-admin-danger" />
            </Button>
          </div>
        ),
      })
    }
    return cols
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnDefs, readOnly])

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  function openCreate() {
    setEditing(null)
    setForm({ ...defaults })
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditing(row)
    const next = { ...defaults }
    for (const field of fields) {
      next[field.name] = row[field.name] ?? defaults[field.name] ?? ''
    }
    setForm(next)
    setFormOpen(true)
  }

  function setField(name, value) {
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      const slugField = fields.find((f) => f.autoFrom === name)
      // Auto-fill slug from source field on create (or when editing a row with no slug yet)
      if (slugField && !editing?.slug) {
        next[slugField.name] = slugify(value)
      }
      return next
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      for (const field of fields) {
        if (field.type === 'number') {
          payload[field.name] = Number(payload[field.name] || 0)
        }
        if (field.type === 'checkbox') {
          payload[field.name] = Boolean(payload[field.name])
        }
      }
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      setFormOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-admin-text-muted">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {headerActions}
          {!readOnly ? (
            <Button variant="accent" size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-admin-border bg-admin-elevated p-4 shadow-admin sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-lg border border-admin-border bg-admin-bg pl-10 pr-3 text-sm outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-ring"
          />
        </label>
        {statusFilter ? (
          <select
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="h-10 rounded-lg border border-admin-border bg-admin-bg px-3 text-sm outline-none focus:border-admin-accent"
          >
            <option value="all">{statusFilter.label}</option>
            {statusFilter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-elevated shadow-admin">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-admin-border bg-admin-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-admin-text-muted"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-admin-border/60">
                      <td colSpan={columns.length} className="px-4 py-3">
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </td>
                    </tr>
                  ))
                : null}
              {!isLoading && table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center text-admin-text-muted"
                  >
                    No records found.
                  </td>
                </tr>
              ) : null}
              {!isLoading &&
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-admin-border/60 transition-colors hover:bg-admin-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-admin-border px-4 py-3">
          <p className="text-xs text-admin-text-muted">
            {filtered.length} record{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </Button>
            <span className="text-xs text-admin-text-muted">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${getRowLabel(editing)}` : addLabel}
        className="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-3">
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {fields.map((field) => {
              if (field.type === 'textarea') {
                return (
                  <Textarea
                    key={field.name}
                    label={field.label}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setField(field.name, e.target.value)}
                    required={field.required}
                    rows={field.rows || 3}
                  />
                )
              }
              if (field.type === 'select') {
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setField(field.name, e.target.value)}
                    required={field.required}
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                )
              }
              if (field.type === 'checkbox') {
                return (
                  <Checkbox
                    key={field.name}
                    label={field.label}
                    checked={Boolean(form[field.name])}
                    onChange={(e) => setField(field.name, e.target.checked)}
                  />
                )
              }
              if (field.type === 'image') {
                return (
                  <ImageUploadField
                    key={field.name}
                    label={field.label}
                    value={form[field.name] ?? ''}
                    onChange={(next) => setField(field.name, next)}
                    accept={field.accept}
                  />
                )
              }
              return (
                <Input
                  key={field.name}
                  label={field.label}
                  type={field.type || 'text'}
                  value={form[field.name] ?? ''}
                  onChange={(e) => setField(field.name, e.target.value)}
                  required={field.required}
                  placeholder={field.placeholder}
                />
              )
            })}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" size="sm" loading={saving}>
              {editing ? 'Save changes' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete record?"
      >
        <p className="text-sm text-admin-text-muted">
          This will permanently remove{' '}
          <span className="font-medium text-admin-text">
            {deleteTarget ? getRowLabel(deleteTarget) : ''}
          </span>
          .
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deleteMutation?.isPending}
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export function StatusBadge({ value }) {
  return <Badge tone={statusTone(value)}>{String(value).replaceAll('_', ' ')}</Badge>
}

export function TextCell({ children, muted }) {
  return (
    <span className={cn(muted ? 'text-admin-text-muted' : 'font-medium text-admin-text')}>
      {children}
    </span>
  )
}
