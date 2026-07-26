import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const hooks = createErpHooks('blog')

const defaults = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  coverUrl: '',
  author: '',
  status: 'draft',
}

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { name: 'body', label: 'Body', type: 'textarea', rows: 8 },
  { name: 'coverUrl', label: 'Cover image', type: 'image' },
  { name: 'author', label: 'Author' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'title',
    header: 'Post',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-11 w-16 overflow-hidden rounded-lg bg-admin-muted">
          {row.original.coverUrl ? (
            <img
              src={row.original.coverUrl}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>
        <div>
          <TextCell>{row.original.title}</TextCell>
          <p className="text-xs text-admin-text-muted">/{row.original.slug}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'author',
    header: 'Author',
    cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
  },
  {
    accessorKey: 'excerpt',
    header: 'Excerpt',
    cell: ({ getValue }) => (
      <span className="line-clamp-1 max-w-[240px] text-sm text-admin-text-muted">
        {getValue() || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function BlogPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Blog"
      description="Publish storefront articles and editorial posts."
      addLabel="Add Post"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search posts…"
      getRowLabel={(row) => row.title}
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
      }}
    />
  )
}
