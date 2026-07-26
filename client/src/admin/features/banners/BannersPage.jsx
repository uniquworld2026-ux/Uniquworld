import { createLocalStore } from '@/admin/lib/createLocalStore'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const seed = [
  {
    id: 'bn_1',
    title: 'Festive Atelier Edit',
    placement: 'home-hero',
    imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=1200&q=80',
    link: '/products',
    sortOrder: 1,
    status: 'active',
    updatedAt: '2026-07-10T10:00:00.000Z',
    createdAt: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'bn_2',
    title: 'Corporate Gifting Desk',
    placement: 'home-secondary',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80',
    link: '/corporate-gifts',
    sortOrder: 2,
    status: 'active',
    updatedAt: '2026-07-08T10:00:00.000Z',
    createdAt: '2026-06-05T10:00:00.000Z',
  },
  {
    id: 'bn_3',
    title: 'Monsoon Sale Strip',
    placement: 'promo-strip',
    imageUrl: '',
    link: '/products?sale=1',
    sortOrder: 3,
    status: 'draft',
    updatedAt: '2026-07-01T10:00:00.000Z',
    createdAt: '2026-06-20T10:00:00.000Z',
  },
]

const store = createLocalStore('hm_admin_banners_v1', seed, 'bn')
const hooks = createModuleHooks('banners', store)

const defaults = {
  title: '',
  placement: 'home-hero',
  imageUrl: '',
  link: '',
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
  { name: 'link', label: 'Link' },
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
    accessorKey: 'link',
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
