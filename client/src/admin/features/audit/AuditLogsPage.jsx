import { createErpHooks } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Badge } from '@/shared/components/ui/Badge'

const hooks = createErpHooks('audit-logs')

const defaults = {
  actor: '',
  action: '',
  entity: '',
  entityId: '',
  details: '',
  status: 'success',
}

const fields = [
  { name: 'actor', label: 'Actor' },
  { name: 'action', label: 'Action', required: true },
  { name: 'entity', label: 'Entity' },
  { name: 'entityId', label: 'Entity ID' },
  { name: 'details', label: 'Details', type: 'textarea' },
  {
    name: 'status',
    label: 'Result',
    type: 'select',
    options: [
      { value: 'success', label: 'Success' },
      { value: 'denied', label: 'Denied' },
      { value: 'info', label: 'Info' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'createdAt',
    header: 'When',
    cell: ({ getValue }) => (
      <TextCell muted>
        {getValue() ? new Date(getValue()).toLocaleString('en-IN') : '—'}
      </TextCell>
    ),
  },
  {
    accessorKey: 'actor',
    header: 'Actor',
    cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'entity',
    header: 'Entity',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'ip',
    header: 'IP',
    cell: ({ row }) => (
      <TextCell muted>{row.original.ip || row.original.entityId || '—'}</TextCell>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Result',
    cell: ({ getValue }) => (
      <Badge tone={getValue() === 'success' ? 'success' : 'danger'}>{getValue()}</Badge>
    ),
  },
]

export function AuditLogsPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Audit Logs"
      description="Immutable trail of admin actions across the console."
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search actors, actions, entities…"
      readOnly
      statusFilter={{
        key: 'status',
        label: 'All results',
        options: [
          { value: 'success', label: 'Success' },
          { value: 'denied', label: 'Denied' },
          { value: 'info', label: 'Info' },
        ],
      }}
    />
  )
}
