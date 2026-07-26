import { Link } from 'react-router-dom'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/Button'

const hooks = createErpHooks('store-products')

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Separate product uploader for the /store channel (not main catalog).
 */
export function StoreProductsPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  const createWrapped = {
    ...createMutation,
    mutateAsync: async (payload) => {
      const slug = payload.slug || slugify(payload.name)
      return createMutation.mutateAsync({
        ...payload,
        slug,
        price: Number(payload.price) || 0,
        compareAtPrice: payload.compareAtPrice === '' ? null : Number(payload.compareAtPrice),
        stock: Number(payload.stock) || 0,
        featured: Boolean(payload.featured),
        gallery: [],
      })
    },
  }

  const updateWrapped = {
    ...updateMutation,
    mutateAsync: async ({ id, data }) => {
      return updateMutation.mutateAsync({
        id,
        data: {
          ...data,
          slug: data.slug || slugify(data.name),
          price: Number(data.price) || 0,
          compareAtPrice: data.compareAtPrice === '' ? null : Number(data.compareAtPrice),
          stock: Number(data.stock) || 0,
          featured: Boolean(data.featured),
        },
      })
    },
  }

  return (
    <AdminCrudPage
      title="Store Products"
      description="Separate uploader for the /store channel — distinct from main Product Management."
      addLabel="Upload store product"
      data={data}
      isLoading={isLoading}
      createMutation={createWrapped}
      updateMutation={updateWrapped}
      deleteMutation={deleteMutation}
      headerActions={
        <Link to="/store" target="_blank">
          <Button variant="outline" size="sm">View /store</Button>
        </Link>
      }
      columns={[
        {
          accessorKey: 'name',
          header: 'Product',
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-lg bg-admin-muted">
                {row.original.imageUrl ? (
                  <img src={row.original.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <TextCell>{row.original.name}</TextCell>
                <p className="text-xs text-admin-text-muted">{row.original.sku || row.original.slug}</p>
              </div>
            </div>
          ),
        },
        { accessorKey: 'category', header: 'Category', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        {
          accessorKey: 'price',
          header: 'Price',
          cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
        },
        { accessorKey: 'stock', header: 'Stock', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
      ]}
      fields={[
        { name: 'name', label: 'Product name', required: true },
        { name: 'slug', label: 'Slug (auto if empty)' },
        { name: 'sku', label: 'SKU' },
        { name: 'category', label: 'Category' },
        { name: 'price', label: 'Price (INR)', type: 'number', required: true },
        { name: 'compareAtPrice', label: 'Compare at price', type: 'number' },
        { name: 'stock', label: 'Stock', type: 'number' },
        { name: 'imageUrl', label: 'Image URL', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
            { value: 'archived', label: 'Archived' },
          ],
        },
        { name: 'featured', label: 'Featured on /store', type: 'checkbox' },
      ]}
      defaults={{
        name: '',
        slug: '',
        sku: '',
        category: 'Wholesale',
        price: 0,
        compareAtPrice: '',
        stock: 0,
        imageUrl: '',
        description: '',
        status: 'draft',
        featured: false,
      }}
      searchPlaceholder="Search store products…"
      statusFilter={{
        key: 'status',
        label: 'Status',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
          { value: 'archived', label: 'Archived' },
        ],
      }}
    />
  )
}
