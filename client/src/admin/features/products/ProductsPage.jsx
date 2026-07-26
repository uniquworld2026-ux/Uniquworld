import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Download, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { PRODUCT_STATUS_LABELS } from '@/admin/features/products/productSchema'
import {
  bulkImportProducts,
  productImportHeaders,
  productImportSampleRows,
  productsToCsvRows,
} from '@/admin/features/products/productStore'
import { useDeleteProduct, useProducts } from '@/admin/features/products/useProducts'
import { downloadCsv, parseCsv, readTextFile } from '@/admin/lib/bulkCsv'
import { AdminPageStats, buildPageStats } from '@/admin/components/crud/AdminPageStats'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { Modal } from '@/shared/components/ui/Modal'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { formatCurrency } from '@/shared/lib/utils'
import { cn } from '@/shared/utils/cn'

function statusTone(status) {
  if (status === 'published' || status === 'active') return 'success'
  if (status === 'draft') return 'warning'
  return 'default'
}

function statusLabel(status) {
  return PRODUCT_STATUS_LABELS[status] || status
}

export function ProductsPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { data = [], isLoading } = useProducts()
  const deleteMutation = useDeleteProduct()
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [importMessage, setImportMessage] = useState('')
  const [importError, setImportError] = useState('')
  const inputRef = useRef(null)

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return data
    if (statusFilter === 'published') {
      return data.filter((p) => p.status === 'published' || p.status === 'active')
    }
    return data.filter((p) => p.status === statusFilter)
  }, [data, statusFilter])

  const pageStats = useMemo(
    () =>
      buildPageStats(data, {
        entityLabel: 'Products',
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
              <p className="truncate text-xs text-admin-text-muted">{row.original.sku}</p>
            </div>
          </div>
        ),
      },
      {
        id: 'categories',
        header: 'Categories',
        cell: ({ row }) => {
          const cats = Array.isArray(row.original.categories) && row.original.categories.length
            ? row.original.categories
            : row.original.category
              ? [row.original.category]
              : []
          return (
            <span className="text-admin-text-muted">
              {cats.length ? cats.join(', ') : '—'}
            </span>
          )
        },
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
        cell: ({ row }) => {
          const stock = row.original.stock
          const low = stock <= row.original.lowStockAt
          return (
            <span className={cn('font-medium', low ? 'text-admin-danger' : 'text-admin-text')}>
              {stock}
            </span>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge tone={statusTone(getValue())}>{statusLabel(getValue())}</Badge>
        ),
      },
      {
        id: 'flags',
        header: 'Flags',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.featured ? <Badge tone="accent">Featured</Badge> : null}
            {row.original.trending ? <Badge tone="info">Trending</Badge> : null}
          </div>
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
              onClick={() => navigate(`/admin/products/${row.original.id}/edit`)}
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
    initialState: { pagination: { pageSize: 8 } },
  })

  async function confirmDelete() {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  async function handleImportFile(file) {
    if (!file) return
    setImportMessage('')
    setImportError('')
    try {
      const text = await readTextFile(file)
      const rows = parseCsv(text)
      if (rows.length === 0) throw new Error('The CSV file is empty.')
      rows.forEach((row, index) => {
        if (!row.name || !row.description || !row.price) {
          throw new Error(`Row ${index + 2}: name, description, and price are required.`)
        }
      })
      const result = bulkImportProducts(rows)
      await qc.invalidateQueries({ queryKey: ['products'] })
      const created = result.created?.length ?? 0
      const updated = result.updated?.length ?? 0
      const parts = []
      if (created) parts.push(`${created} created`)
      if (updated) parts.push(`${updated} updated`)
      setImportMessage(
        parts.length
          ? `Bulk import complete: ${parts.join(', ')}.`
          : `Processed ${rows.length} row${rows.length === 1 ? '' : 's'}.`,
      )
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
            Product Management
          </h2>
          <p className="mt-1 max-w-xl text-sm text-admin-text-muted">
            Create, edit, and manage catalog inventory. Import CSV to create or update by id / SKU /
            slug.
          </p>
          {importMessage ? <p className="mt-1 text-xs text-admin-success">{importMessage}</p> : null}
          {importError ? <p className="mt-1 text-xs text-admin-danger">{importError}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => {
              void handleImportFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-9 whitespace-nowrap"
            onClick={() =>
              downloadCsv('products-sample-template.csv', productImportSampleRows, productImportHeaders)
            }
          >
            <Download className="h-4 w-4" />
            Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 whitespace-nowrap"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 whitespace-nowrap"
            onClick={() => downloadCsv('products-export.csv', productsToCsvRows(data), productImportHeaders)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            variant="accent"
            size="sm"
            className="h-9 whitespace-nowrap"
            onClick={() => navigate('/admin/products/new')}
          >
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </div>
      </div>

      <AdminPageStats stats={pageStats} />

      <div className="flex flex-col gap-3 rounded-2xl border border-admin-border bg-admin-elevated p-4 shadow-admin sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by name, SKU, category…"
            className="h-10 w-full rounded-lg border border-admin-border bg-admin-bg pl-10 pr-3 text-sm outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-ring"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-admin-border bg-admin-bg px-3 text-sm outline-none focus:border-admin-accent"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-elevated shadow-admin">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
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
                  <td colSpan={columns.length} className="px-4 py-16 text-center text-admin-text-muted">
                    No products found. Create your first product.
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
            {filtered.length} product{filtered.length === 1 ? '' : 's'}
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
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete product?"
      >
        <p className="text-sm text-admin-text-muted">
          This will permanently remove{' '}
          <span className="font-medium text-admin-text">{deleteTarget?.name}</span> from the
          catalog.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={deleteMutation.isPending}
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
