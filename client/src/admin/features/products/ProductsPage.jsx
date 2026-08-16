import { useMemo, useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  buildProductWorkbookSheets,
  productImportSampleRows,
  productsToCsvRows,
} from '@/admin/features/products/productStore'
import {
  useDeleteProduct,
  useDeleteProducts,
  useProducts,
} from '@/admin/features/products/useProducts'
import { parseCsv, readTextFile } from '@/admin/lib/bulkCsv'
import {
  downloadWorkbook,
  isExcelFile,
  parseSpreadsheetRows,
  readSpreadsheetFile,
} from '@/admin/lib/bulkExcel'
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

function SelectionCheckbox({ checked, indeterminate, onChange, ariaLabel, disabled }) {
  return (
    <input
      type="checkbox"
      className="h-4 w-4 rounded border-admin-border text-admin-accent focus:ring-admin-ring disabled:opacity-50"
      checked={checked}
      disabled={disabled}
      ref={(el) => {
        if (el) el.indeterminate = Boolean(indeterminate)
      }}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={ariaLabel}
    />
  )
}

export function ProductsPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const { data = [], isLoading } = useProducts()
  const deleteMutation = useDeleteProduct()
  const bulkDeleteMutation = useDeleteProducts()
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rowSelection, setRowSelection] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [flash, setFlash] = useState('')
  const [importMessage, setImportMessage] = useState('')
  const [importError, setImportError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const msg = location.state?.flash
    if (!msg) return undefined
    setFlash(msg)
    navigate(location.pathname, { replace: true, state: {} })
    const timer = window.setTimeout(() => setFlash(''), 6000)
    return () => window.clearTimeout(timer)
  }, [location.state, location.pathname, navigate])

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return data
    if (statusFilter === 'published') {
      return data.filter((p) => p.status === 'published' || p.status === 'active')
    }
    return data.filter((p) => p.status === statusFilter)
  }, [data, statusFilter])

  useEffect(() => {
    setRowSelection({})
  }, [statusFilter, globalFilter])

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
        id: 'select',
        header: ({ table }) => (
          <SelectionCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            ariaLabel="Select all products on this page"
          />
        ),
        cell: ({ row }) => (
          <SelectionCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            ariaLabel={`Select ${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },
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
    state: { globalFilter, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getRowId: (row) => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const selectedIds = selectedRows.map((row) => row.original.id)
  const selectedNames = selectedRows.map((row) => row.original.name)

  async function confirmDelete() {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setRowSelection((prev) => {
      const next = { ...prev }
      delete next[String(deleteTarget.id)]
      return next
    })
    setDeleteTarget(null)
  }

  async function confirmBulkDelete() {
    if (!selectedIds.length) return
    const result = await bulkDeleteMutation.mutateAsync(selectedIds)
    setRowSelection({})
    setBulkDeleteOpen(false)
    if (result.errors?.length) {
      setFlash(
        `Deleted ${result.deleted} of ${result.total}. ${result.errors.length} failed.`,
      )
    } else {
      setFlash(
        `Deleted ${result.deleted} product${result.deleted === 1 ? '' : 's'}.`,
      )
    }
    window.setTimeout(() => setFlash(''), 6000)
  }

  async function handleImportFile(file) {
    if (!file) return
    setImportMessage('')
    setImportError('')
    try {
      const rows = isExcelFile(file)
        ? parseSpreadsheetRows(await readSpreadsheetFile(file))
        : parseCsv(await readTextFile(file))
      if (rows.length === 0) throw new Error('The file is empty.')
      rows.forEach((row, index) => {
        if (!row.name || !row.description || !row.price) {
          throw new Error(`Row ${index + 2}: name, description, and price are required.`)
        }
      })
      const result = await bulkImportProducts(rows)
      await qc.invalidateQueries({ queryKey: ['products'] })
      const created = result.created?.length ?? 0
      const updated = result.updated?.length ?? 0
      const failed = result.errors?.length ?? 0
      const parts = []
      if (created) parts.push(`${created} created`)
      if (updated) parts.push(`${updated} updated`)
      if (failed) parts.push(`${failed} failed`)
      setImportMessage(
        parts.length
          ? `Bulk import complete: ${parts.join(', ')}.`
          : `Processed ${rows.length} row${rows.length === 1 ? '' : 's'}.`,
      )
      if (failed) {
        setImportError(result.errors.map((e) => `Row ${e.row}: ${e.message}`).join(' · '))
      }
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
            Create, edit, and manage catalog inventory. Download the Excel sample — it includes every
            product field. Import .xlsx or .csv to create or update by id / SKU / slug.
          </p>
          {flash ? (
            <p
              className="mt-2 rounded-lg border border-admin-success/30 bg-admin-success/10 px-3 py-2 text-sm text-admin-success"
              role="status"
            >
              {flash}
            </p>
          ) : null}
          {importMessage ? <p className="mt-1 text-xs text-admin-success">{importMessage}</p> : null}
          {importError ? <p className="mt-1 text-xs text-admin-danger">{importError}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
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
              downloadWorkbook(
                'products-sample-template.xlsx',
                buildProductWorkbookSheets(productImportSampleRows),
              )
            }
          >
            <Download className="h-4 w-4" />
            Excel sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 whitespace-nowrap"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 whitespace-nowrap"
            onClick={() =>
              downloadWorkbook(
                'products-export.xlsx',
                buildProductWorkbookSheets(productsToCsvRows(data)),
              )
            }
          >
            <Download className="h-4 w-4" />
            Export Excel
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

      {selectedCount > 0 ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-admin-danger/25 bg-admin-danger/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-admin-text">
            {selectedCount} product{selectedCount === 1 ? '' : 's'} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setRowSelection({})}>
              Clear selection
            </Button>
            <Button variant="danger" size="sm" onClick={() => setBulkDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete selected
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-elevated shadow-admin">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-admin-border bg-admin-muted/40">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-admin-text-muted',
                        header.id === 'select' && 'w-12',
                      )}
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
                    className={cn(
                      'border-b border-admin-border/60 transition-colors hover:bg-admin-muted/30',
                      row.getIsSelected() && 'bg-admin-accent/5',
                    )}
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
            {selectedCount > 0 ? ` · ${selectedCount} selected` : ''}
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

      <Modal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title={`Delete ${selectedCount} product${selectedCount === 1 ? '' : 's'}?`}
      >
        <p className="text-sm text-admin-text-muted">
          This will permanently remove the selected products from the catalog.
        </p>
        {selectedNames.length > 0 ? (
          <ul className="mt-3 max-h-40 list-disc space-y-1 overflow-y-auto pl-5 text-sm text-admin-text">
            {selectedNames.slice(0, 12).map((name) => (
              <li key={name}>{name}</li>
            ))}
            {selectedNames.length > 12 ? (
              <li className="list-none text-admin-text-muted">
                +{selectedNames.length - 12} more
              </li>
            ) : null}
          </ul>
        ) : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setBulkDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={bulkDeleteMutation.isPending}
            onClick={confirmBulkDelete}
          >
            Delete selected
          </Button>
        </div>
      </Modal>
    </div>
  )
}
