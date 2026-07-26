import { useMemo, useState } from 'react'
import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const hooks = createErpHooks('personalized-orders')

const defaults = {
  orderRef: '',
  customer: 'Guest',
  productId: '',
  product: '',
  personalization: '',
  customText: '',
  photoName: '',
  photoDataUrl: '',
  status: 'pending',
}

const fields = [
  { name: 'orderRef', label: 'Order ref', required: true },
  { name: 'customer', label: 'Customer', required: true },
  { name: 'product', label: 'Product', required: true },
  { name: 'customText', label: 'Custom text', type: 'textarea' },
  { name: 'photoName', label: 'Photo file name' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'processing', label: 'Processing' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'orderRef',
    header: 'Ref',
    cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ row }) => (
      <div className="min-w-0">
        <TextCell>{row.original.product}</TextCell>
        {row.original.productId ? (
          <p className="truncate text-xs text-admin-text-muted">{row.original.productId}</p>
        ) : null}
      </div>
    ),
  },
  {
    id: 'customization',
    header: 'Customization',
    cell: ({ row }) => {
      const { customText, photoName, photoDataUrl, personalization } = row.original
      return (
        <div className="flex max-w-[280px] items-start gap-2">
          {photoDataUrl ? (
            <img
              src={photoDataUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded-md object-cover"
            />
          ) : null}
          <div className="min-w-0">
            {customText ? (
              <p className="line-clamp-2 text-sm text-admin-text">{customText}</p>
            ) : (
              <p className="line-clamp-2 text-sm text-admin-text-muted">{personalization}</p>
            )}
            {photoName ? (
              <p className="mt-0.5 truncate text-xs text-admin-text-muted">Photo: {photoName}</p>
            ) : null}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

function fromErpRow(row) {
  const customization = row.customization || ''
  return {
    ...row,
    customer: row.customerName || row.customer || '',
    product: row.productName || row.product || '',
    customText: row.customText || customization,
    personalization: row.personalization || customization,
    photoName: row.photoName || '',
    photoDataUrl: row.photoDataUrl || '',
  }
}

function toErpPayload(payload) {
  return {
    orderRef: payload.orderRef,
    customerName: payload.customer || payload.customerName || 'Guest',
    productName: payload.product || payload.productName || '',
    customization: payload.customText || payload.personalization || payload.customization || '',
    notes: [payload.photoName ? `Photo: ${payload.photoName}` : '', payload.notes]
      .filter(Boolean)
      .join('\n'),
    status: payload.status || 'pending',
    email: payload.email || '',
    totalAmount: Number(payload.totalAmount) || 0,
  }
}

export function PersonalizedOrdersPage() {
  const { data: raw = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()
  const [productFilter, setProductFilter] = useState('all')

  const data = useMemo(() => raw.map(fromErpRow), [raw])

  const createWrapped = {
    ...createMutation,
    mutateAsync: async (payload) => createMutation.mutateAsync(toErpPayload(payload)),
  }

  const updateWrapped = {
    ...updateMutation,
    mutateAsync: async ({ id, data: row }) =>
      updateMutation.mutateAsync({ id, data: toErpPayload(row) }),
  }

  const productOptions = useMemo(() => {
    const map = new Map()
    data.forEach((row) => {
      const key = row.productId || row.product
      if (!key) return
      const prev = map.get(key)
      map.set(key, {
        value: key,
        label: row.product || key,
        count: (prev?.count || 0) + 1,
      })
    })
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label))
  }, [data])

  const filteredData = useMemo(() => {
    if (productFilter === 'all') return data
    return data.filter((row) => (row.productId || row.product) === productFilter)
  }, [data, productFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-admin-text-muted">
          By product
        </span>
        <button
          type="button"
          onClick={() => setProductFilter('all')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            productFilter === 'all'
              ? 'bg-admin-primary text-white'
              : 'bg-admin-muted text-admin-text hover:bg-admin-border'
          }`}
        >
          All ({data.length})
        </button>
        {productOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setProductFilter(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              productFilter === opt.value
                ? 'bg-admin-primary text-white'
                : 'bg-admin-muted text-admin-text hover:bg-admin-border'
            }`}
          >
            {opt.label} ({opt.count})
          </button>
        ))}
      </div>

      <AdminCrudPage
        title="Personalized Orders"
        description="Customized product requests with photo and text — filter by product above."
        addLabel="Add Order"
        data={filteredData}
        isLoading={isLoading}
        createMutation={createWrapped}
        updateMutation={updateWrapped}
        deleteMutation={deleteMutation}
        columns={columns}
        fields={fields}
        defaults={defaults}
        searchPlaceholder="Search by product, text, photo…"
        getRowLabel={(row) => row.orderRef}
        statusFilter={{
          key: 'status',
          label: 'All statuses',
          options: [
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ],
        }}
      />
    </div>
  )
}
