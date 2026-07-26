import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { STORE_PRODUCT_STATUS_LABELS } from '@/admin/features/stores/storeProductSchema'
import { AdminPageStats, buildPageStats } from '@/admin/components/crud/AdminPageStats'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { formatCurrency } from '@/shared/lib/utils'
import { cn } from '@/shared/utils/cn'

const hooks = createErpHooks('store-products')

function statusTone(status) {
  if (status === 'published') return 'success'
  if (status === 'draft') return 'warning'
  return 'default'
}

/**
 * Store channel product list — separate uploader from main Product Management.
 */
export function StoreProductsPage() {
  const navigate = useNavigate()
  const { data = [], isLoading } = hooks.useList()
  const deleteMutation = hooks.useRemove()
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return data
    return data.filter((p) => p.status === statusFilter)
  }, [data, statusFilter])

  const pageStats = useMemo(
    () =>
      buildPageStats(data, {
        entityLabel: 'Store products',
        statusOptions: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'archived', label: 'Archived' },
        ],
      }),
    [data],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Product',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-lg bg-admin-muted">
              {row.original.imageUrl ? (
                <img
                  src={row.original.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-admin-text">{row.original.name}</p>
              <p className="truncate text-xs text-admin-text-muted">
                {row.original.sku || row.original.slug}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ getValue }) => (
          <span className="text-admin-text-muted">{getValue() || '—'}</span>
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ getValue }) => (
          <span className="font-medium text-admin-text">{formatCurrency(getValue())}</span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ getValue }) => <span className="text-admin-text-muted">{getValue()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge tone={statusTone(getValue())}>
            {STORE_PRODUCT_STATUS_LABELS[getValue()] || getValue()}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit"
              onClick={() => navigate(`/admin/store-products/${row.original.id}/edit`)}
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
      },
    ],
    [navigate],
  )

  const table = useReactTable({
    data: filtered,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-admin-text">Store Products</h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            Separate product uploader for the <span className="font-medium">/store</span> channel —
            distinct from main Product Management.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/store" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              View /store
            </Button>
          </Link>
          <Button size="sm" onClick={() => navigate('/admin/store-products/new')}>
            <Plus className="mr-1.5 h-4 w-4" />
            Upload store product
          </Button>
        </div>
      </div>

      <AdminPageStats stats={pageStats} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search store products…"
            className="h-10 w-full rounded-xl border border-admin-border bg-admin-elevated pl-9 pr-3 text-sm text-admin-text outline-none focus:border-admin-accent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-admin-border bg-admin-elevated px-3 text-sm text-admin-text"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-elevated shadow-admin">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-admin-border bg-admin-muted/40 text-xs uppercase tracking-wide text-admin-text-muted">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id} className="px-4 py-3 font-medium">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-12 text-center text-admin-text-muted">
                      No store products yet. Upload one to show it on /store.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        'border-b border-admin-border/70 last:border-0',
                        'hover:bg-admin-muted/30',
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-admin-border px-4 py-3 text-sm text-admin-text-muted">
          <span>
            {table.getFilteredRowModel().rows.length} product
            {table.getFilteredRowModel().rows.length === 1 ? '' : 's'}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </Button>
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
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete store product?"
      >
        <p className="text-sm text-admin-text-muted">
          Remove <span className="font-medium text-admin-text">{deleteTarget?.name}</span> from the
          /store catalog? This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={deleteMutation.isPending}
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
