import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useErpPayments } from '@/admin/lib/createErpHooks'
import { AdminCrudPage, StatusBadge, TextCell } from '@/admin/components/crud/AdminCrudPage'
import { formatCurrency } from '@/shared/lib/utils'

export function PaymentsPage() {
  const { data = [], isLoading } = useErpPayments()
  const qc = useQueryClient()

  // Payments are created by checkout — admin view is read-focused
  const noop = useMutation({
    mutationFn: async () => {
      throw new Error('Create payments from checkout')
    },
  })

  return (
    <AdminCrudPage
      title="Payment Management"
      description="Razorpay and COD payments synced from live orders."
      addLabel="Payments are system-generated"
      data={data}
      isLoading={isLoading}
      createMutation={noop}
      updateMutation={noop}
      deleteMutation={{
        mutateAsync: async () => {
          qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'payments'] })
        },
      }}
      readOnly
      columns={[
        {
          accessorKey: 'orderNumber',
          header: 'Order',
          cell: ({ getValue }) => <TextCell>{getValue()}</TextCell>,
        },
        { accessorKey: 'method', header: 'Method', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        { accessorKey: 'gateway', header: 'Gateway', cell: ({ getValue }) => <TextCell muted>{getValue()}</TextCell> },
        {
          accessorKey: 'amount',
          header: 'Amount',
          cell: ({ getValue }) => <TextCell>{formatCurrency(getValue())}</TextCell>,
        },
        { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
        {
          accessorKey: 'gatewayPaymentId',
          header: 'Gateway ID',
          cell: ({ getValue }) => <TextCell muted>{getValue() || '—'}</TextCell>,
        },
      ]}
      fields={[]}
      defaults={{}}
      searchPlaceholder="Search payments…"
    />
  )
}
