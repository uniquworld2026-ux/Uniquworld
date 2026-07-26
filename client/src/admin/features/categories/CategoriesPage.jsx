import { useRef, useState, useMemo, useSyncExternalStore } from 'react'
import { Download, Upload } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import {
  bulkImportCategories,
  createCategory,
  categoryImportHeaders,
  categoryImportSampleRows,
  deleteCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from '@/admin/features/categories/categoryStore'
import { listProducts } from '@/admin/features/products/productStore'
import {
  countAllProductsInCategory,
  countLiveProductsInCategory,
} from '@/shared/catalog/liveCatalog'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { downloadCsv, parseCsv, readTextFile } from '@/admin/lib/bulkCsv'
import { Button } from '@/shared/components/ui/Button'

const store = {
  list: listCategories,
  getById: getCategoryById,
  create: createCategory,
  update: updateCategory,
  remove: deleteCategory,
}

const hooks = createModuleHooks('categories', store)

const PRODUCT_KEY = 'hm_admin_products_v1'
let productsCache = null

function invalidateProductsCache() {
  productsCache = null
}

function getProductsSnapshot() {
  if (!productsCache) {
    try {
      productsCache = listProducts()
    } catch {
      productsCache = []
    }
  }
  return productsCache
}

function subscribeProducts(callback) {
  const onChange = () => {
    invalidateProductsCache()
    callback()
  }
  const onStorage = (e) => {
    if (!e.key || e.key === PRODUCT_KEY) onChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener('hm-catalog-changed', onChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('hm-catalog-changed', onChange)
  }
}

const defaults = {
  name: '',
  slug: '',
  description: '',
  status: 'published',
  productCount: 0,
  imageUrl: '',
}

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'slug', label: 'Slug', required: true, autoFrom: 'name' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'imageUrl', label: 'Image', type: 'image' },
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
  const products = useSyncExternalStore(subscribeProducts, getProductsSnapshot, getProductsSnapshot)
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
      const rows = parseCsv(text)
      if (rows.length === 0) throw new Error('The CSV file is empty.')
      rows.forEach((row, index) => {
        if (!row.name || !row.slug) {
          throw new Error(`Row ${index + 2}: name and slug are required.`)
        }
      })
      bulkImportCategories(rows)
      await qc.invalidateQueries({ queryKey: hooks.keys.all })
      setImportMessage(`Imported ${rows.length} categor${rows.length === 1 ? 'y' : 'ies'}.`)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed.')
    }
  }

  return (
    <AdminCrudPage
      title="Category Management"
      description={importError || importMessage || undefined}
      addLabel="Add Category"
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
            onClick={() =>
              downloadCsv('categories-sample-template.csv', categoryImportSampleRows, categoryImportHeaders)
            }
          >
            <Download className="h-4 w-4" />
            Sample Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Import CSV
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
