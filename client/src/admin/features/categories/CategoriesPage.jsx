import { useMemo, useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { createCategory } from '@/admin/features/categories/categoryStore'
import { useProducts } from '@/admin/features/products/useProducts'
import {
  countAllProductsInCategory,
  countLiveProductsInCategory,
} from '@/shared/catalog/liveCatalog'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { downloadCsv, parseCsv, readTextFile } from '@/admin/lib/bulkCsv'
import { Button } from '@/shared/components/ui/Button'

const hooks = createErpHooks('categories')

const categoryImportHeaders = [
  { key: 'name', label: 'name' },
  { key: 'slug', label: 'slug' },
  { key: 'description', label: 'description' },
  { key: 'status', label: 'status' },
]

const categoryImportSampleRows = [
  { name: 'Gifts', slug: 'gifts', description: 'Gift catalogue', status: 'published' },
]

const defaults = {
  name: '',
  slug: '',
  description: '',
  status: 'published',
  sortOrder: 0,
  imageUrl: '',
}

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true, autoFrom: 'name' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'imageUrl', label: 'Image', type: 'image' },
  { name: 'sortOrder', label: 'Sort order', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

export function CategoriesPage() {
  const qc = useQueryClient()
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()
  const { data: products = [] } = useProducts()
  const inputRef = useRef(null)
  const [importMessage, setImportMessage] = useState('')
  const [importError, setImportError] = useState('')

  const rows = useMemo(
    () =>
      data.map((cat) => {
        const live = countLiveProductsInCategory(products, cat.name, data)
        const total = countAllProductsInCategory(products, cat.name, data)
        return {
          ...cat,
          productCount: live,
          draftProductCount: Math.max(0, total - live),
          totalProductCount: total,
        }
      }),
    [data, products],
  )

  const columns = [
    {
      accessorKey: 'name',
      header: 'Category',
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
          <div>
            <TextCell>{row.original.name}</TextCell>
            <p className="text-xs text-admin-text-muted">{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'productCount',
      header: 'Items',
      cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
    },
    {
      accessorKey: 'draftProductCount',
      header: 'Draft',
      cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
    },
    {
      accessorKey: 'totalProductCount',
      header: 'Total Items',
      cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge value={getValue()} />,
    },
  ]

  async function handleImportFile(file) {
    if (!file) return
    setImportMessage('')
    setImportError('')
    try {
      const text = await readTextFile(file)
      const csvRows = parseCsv(text)
      if (csvRows.length === 0) throw new Error('The CSV file is empty.')
      for (const [index, row] of csvRows.entries()) {
        if (!row.name) throw new Error(`Row ${index + 2}: name is required.`)
        await createCategory(row)
      }
      await qc.invalidateQueries({ queryKey: hooks.keys.all })
      setImportMessage(`Imported ${csvRows.length} categor${csvRows.length === 1 ? 'y' : 'ies'}.`)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed.')
    }
  }

  return (
    <AdminCrudPage
      title="Category Management"
      description={
        importError ||
        importMessage ||
        'Live categories from the ERP database — used by Product Management and the storefront.'
      }
      addLabel="Add Category"
      entityLabel="Categories"
      data={rows}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      headerActions={
        <>
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
            className="h-9"
            onClick={() =>
              downloadCsv('categories-sample-template.csv', categoryImportSampleRows, categoryImportHeaders)
            }
          >
            <Download className="h-4 w-4" />
            Sample
          </Button>
          <Button variant="outline" size="sm" className="h-9" onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </>
      }
      searchPlaceholder="Search categories…"
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'archived', label: 'Archived' },
        ],
      }}
    />
  )
}
