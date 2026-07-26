import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const hooks = createErpHooks('cms')

const defaults = {
  title: '',
  slug: '',
  body: '',
  status: 'draft',
}

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'slug', label: 'Slug', required: true },
  { name: 'body', label: 'Content', type: 'textarea', rows: 5 },
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
]

const columns = [
  {
    accessorKey: 'title',
    header: 'Page',
    cell: ({ row }) => (
      <div>
        <TextCell>{row.original.title}</TextCell>
        <p className="text-xs text-admin-text-muted">/{row.original.slug}</p>
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ getValue }) => (
      <TextCell muted>
        {getValue() ? new Date(getValue()).toLocaleDateString('en-IN') : '—'}
      </TextCell>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function CmsPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="CMS"
      description="Edit static storefront pages and content blocks."
      addLabel="Add Page"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search pages…"
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
          { value: 'archived', label: 'Archived' },
        ],
      }}
    />
  )
}
