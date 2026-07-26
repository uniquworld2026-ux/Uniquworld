import { useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { listProducts } from '@/admin/features/products/productStore'
import { createReview, reviewsStore } from '@/admin/features/reviews/reviewStore'

const hooks = createModuleHooks('reviews', {
  list: () => reviewsStore.list(),
  getById: (id) => reviewsStore.getById(id),
  create: (payload) => createReview(payload),
  update: (id, data) => reviewsStore.update(id, data),
  remove: (id) => reviewsStore.remove(id),
})

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

export function ReviewsPage() {
  const qc = useQueryClient()
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  useEffect(() => {
    const onChange = () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
    }
    window.addEventListener('hm-catalog-changed', onChange)
    return () => window.removeEventListener('hm-catalog-changed', onChange)
  }, [qc])

  const productOptions = useMemo(() => {
    try {
      return listProducts()
        .map((p) => ({
          value: p.id,
          label: p.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
    } catch {
      return []
    }
  }, [data])

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
    mutateAsync: async (payload) => {
      const product = listProducts().find((p) => p.id === payload.productId)
      return createMutation.mutateAsync({
        ...payload,
        productId: payload.productId || product?.id || '',
        product: product?.name || payload.product || '',
      })
    },
  }

  const wrappedUpdate = {
    ...updateMutation,
    mutateAsync: async ({ id, data }) => {
      const product = listProducts().find((p) => p.id === data.productId)
      return updateMutation.mutateAsync({
        id,
        data: {
          ...data,
          productId: data.productId || product?.id || '',
          product: product?.name || data.product || '',
        },
      })
    },
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
