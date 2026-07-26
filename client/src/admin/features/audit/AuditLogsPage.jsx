import { createLocalStore } from '@/admin/lib/createLocalStore'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { Badge } from '@/shared/components/ui/Badge'

const seed = [
  {
    id: 'log_1',
    actor: 'admin@uniquworld.example',
    action: 'product.update',
    entity: 'Walnut Serving Tray',
    ip: '103.21.44.12',
    status: 'success',
    updatedAt: '2026-07-21T14:22:00.000Z',
    createdAt: '2026-07-21T14:22:00.000Z',
  },
  {
    id: 'log_2',
    actor: 'ops@uniquworld.example',
    action: 'order.status',
    entity: 'HM-10471',
    ip: '103.21.44.18',
    status: 'success',
    updatedAt: '2026-07-21T11:05:00.000Z',
    createdAt: '2026-07-21T11:05:00.000Z',
  },
  {
    id: 'log_3',
    actor: 'admin@uniquworld.example',
    action: 'coupon.create',
    entity: 'WELCOME10',
    ip: '103.21.44.12',
    status: 'success',
    updatedAt: '2026-07-20T09:40:00.000Z',
    createdAt: '2026-07-20T09:40:00.000Z',
  },
  {
    id: 'log_4',
    actor: 'viewer@uniquworld.example',
    action: 'settings.update',
    entity: 'Store settings',
    ip: '49.37.12.88',
    status: 'denied',
    updatedAt: '2026-07-19T16:12:00.000Z',
    createdAt: '2026-07-19T16:12:00.000Z',
  },
]

const store = createLocalStore('hm_admin_audit_v1', seed, 'log')
const hooks = createModuleHooks('audit-logs', store)

const columns = [
  {
    accessorKey: 'createdAt',
    header: 'When',
    cell: ({ getValue }) => (
      <TextCell muted>{new Date(getValue()).toLocaleString('en-IN')}</TextCell>
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
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
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

  return (
    <AdminCrudPage
      title="Audit Logs"
      description="Immutable trail of admin actions across the console."
      data={data}
      isLoading={isLoading}
      columns={columns}
      fields={[]}
      defaults={{}}
      searchPlaceholder="Search actors, actions, entities…"
      readOnly
      statusFilter={{
        key: 'status',
        label: 'All results',
        options: [
          { value: 'success', label: 'Success' },
          { value: 'denied', label: 'Denied' },
        ],
      }}
    />
  )
}
