import { useMemo } from 'react'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const hooks = createErpHooks('reviews')
const productHooks = createErpHooks('products')

const defaults = {
  product: '',
  productId: '',
  customer: '',
  rating: 5,
  comment: '',
  status: 'approved',
}

const columns = [
  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ getValue }) => <TextCell>{getValue()} ★</TextCell>,
  },
  {
    accessorKey: 'comment',
    header: 'Comment',
    cell: ({ getValue }) => (
      <span className="line-clamp-1 max-w-[240px] text-admin-text-muted">{getValue()}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

function fromErpRow(row) {
  return {
    ...row,
    product: row.productName || row.product || '',
    customer: row.author || row.customer || '',
    comment: row.body || row.comment || '',
  }
}

function toErpPayload(payload, products = []) {
  const product = products.find((p) => p.id === payload.productId)
  return {
    productId: payload.productId || product?.id || '',
    productName: product?.name || payload.product || payload.productName || '',
    author: payload.customer || payload.author || '',
    rating: Number(payload.rating) || 5,
    title: payload.title || '',
    body: payload.comment || payload.body || '',
    status: payload.status || 'pending',
  }
}

export function ReviewsPage() {
  const { data: raw = [], isLoading } = hooks.useList()
  const { data: products = [] } = productHooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  const data = useMemo(() => raw.map(fromErpRow), [raw])

  const productOptions = useMemo(
    () =>
      [...products]
        .map((p) => ({ value: p.id, label: p.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [products],
  )

  const fields = useMemo(
    () => [
      {
        name: 'productId',
        label: 'Product',
        type: 'select',
        required: true,
        options: productOptions,
      },
      { name: 'customer', label: 'Customer', required: true },
      { name: 'rating', label: 'Rating (1-5)', type: 'number', required: true },
      { name: 'comment', label: 'Comment', type: 'textarea' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ],
      },
    ],
    [productOptions],
  )

  const wrappedCreate = {
    ...createMutation,
    mutateAsync: async (payload) =>
      createMutation.mutateAsync(toErpPayload(payload, products)),
  }

  const wrappedUpdate = {
    ...updateMutation,
    mutateAsync: async ({ id, data: row }) =>
      updateMutation.mutateAsync({ id, data: toErpPayload(row, products) }),
  }

  return (
    <AdminCrudPage
      title="Reviews"
      description="Product-wise reviews shown on the storefront when status is Approved."
      addLabel="Add Review"
      data={data}
      isLoading={isLoading}
      createMutation={wrappedCreate}
      updateMutation={wrappedUpdate}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search by product, customer…"
      getRowLabel={(row) => row.product}
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ],
      }}
    />
  )
}
