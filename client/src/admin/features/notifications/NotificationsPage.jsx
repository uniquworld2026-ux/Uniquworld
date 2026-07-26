import { createLocalStore } from '@/admin/lib/createLocalStore'
import { createModuleHooks } from '@/admin/lib/createModuleHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'

const seed = [
  {
    id: 'nt_1',
    title: 'Order shipped — HM-10471',
    channel: 'email',
    audience: 'Rahul Mehta',
    status: 'sent',
    scheduledAt: '2026-07-19T11:00:00.000Z',
    updatedAt: '2026-07-19T11:05:00.000Z',
    createdAt: '2026-07-19T10:00:00.000Z',
  },
  {
    id: 'nt_2',
    title: 'Diwali early access',
    channel: 'push',
    audience: 'All customers',
    status: 'scheduled',
    scheduledAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-07-20T10:00:00.000Z',
    createdAt: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'nt_3',
    title: 'Low stock alert — BC-091',
    channel: 'in-app',
    audience: 'Admins',
    status: 'unread',
    scheduledAt: '2026-07-17T08:00:00.000Z',
    updatedAt: '2026-07-17T08:00:00.000Z',
    createdAt: '2026-07-17T08:00:00.000Z',
  },
]

const store = createLocalStore('hm_admin_notifications_v1', seed, 'nt')
const hooks = createModuleHooks('notifications', store)

const defaults = {
  title: '',
  channel: 'email',
  audience: '',
  body: '',
  status: 'draft',
  scheduledAt: '',
}

const fields = [
  { name: 'title', label: 'Title', required: true },
  {
    name: 'channel',
    label: 'Channel',
    type: 'select',
    options: [
      { value: 'email', label: 'Email' },
      { value: 'push', label: 'Push' },
      { value: 'sms', label: 'SMS' },
      { value: 'in-app', label: 'In-app' },
    ],
  },
  { name: 'audience', label: 'Audience', required: true },
  { name: 'body', label: 'Message', type: 'textarea' },
  { name: 'scheduledAt', label: 'Schedule (ISO datetime)', placeholder: '2026-08-01T09:00:00.000Z' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'sent', label: 'Sent' },
      { value: 'unread', label: 'Unread' },
    ],
  },
]

const columns = [
  {
    accessorKey: 'title',
    header: 'Notification',
    cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'channel',
    header: 'Channel',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'audience',
    header: 'Audience',
    cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadge value={getValue()} />,
  },
]

export function NotificationsPage() {
  const { data = [], isLoading } = hooks.useList()
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useRemove()

  return (
    <AdminCrudPage
      title="Notifications"
      description="Compose transactional and marketing notifications."
      addLabel="Add Notification"
      data={data}
      isLoading={isLoading}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      columns={columns}
      fields={fields}
      defaults={defaults}
      searchPlaceholder="Search notifications…"
      statusFilter={{
        key: 'status',
        label: 'All statuses',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'sent', label: 'Sent' },
          { value: 'unread', label: 'Unread' },
        ],
      }}
    />
  )
}
