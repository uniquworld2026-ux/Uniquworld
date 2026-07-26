import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const hooks = createErpHooks('banners')

const defaults = {
  title: '',
  placement: 'home-hero',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 1,
  status: 'draft',
}

const fields = [
  { name: 'title', label: 'Title', required: true },
  {
    name: 'placement',
    label: 'Placement',
    type: 'select',
    options: [
      { value: 'home-hero', label: 'Home hero' },
      { value: 'home-secondary', label: 'Home secondary' },
      { value: 'promo-strip', label: 'Promo strip' },
      { value: 'category', label: 'Category page' },
    ],
  },
  { name: 'imageUrl', label: 'Image URL' },
  { name: 'linkUrl', label: 'Link' },
  { name: 'sortOrder', label: 'Sort order', type: 'number' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'draft', label: 'Draft' },
      { value: 'archived', label: 'Archived' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'title',
    header: 'Banner',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-11 w-16 overflow-hidden rounded-lg bg-admin-muted">
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
          <TextCell>{row.original.title}</TextCell>
          <p className="text-xs text-admin-text-muted">{row.original.placement}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'linkUrl',
    header: 'Link',
    cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
  },
  {
    accessorKey: 'sortOrder',
    header: 'Order',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function BannersPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Banner Management"
      description="Schedule and place promotional banners across the storefront."
      addLabel="Add Banner"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search banners…"
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'draft', label: 'Draft' },
          { value: 'archived', label: 'Archived' },
        ],
      }}
    />
  )
}
