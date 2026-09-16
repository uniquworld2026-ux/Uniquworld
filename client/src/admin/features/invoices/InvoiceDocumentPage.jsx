import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { erpApi } from '@/admin/lib/erpApi'
import { OrderInvoicePanel } from '@/admin/components/commerce/OrderInvoicePanel'
import { Button } from '@/shared/components/ui/Button'

export function InvoiceDocumentPage() {
  const { source, invoiceId } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['erp', 'commerce', 'invoices', source, invoiceId],
    queryFn: () => erpApi.getInvoice(source, invoiceId),
    enabled: Boolean(source && invoiceId),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/invoices" className="inline-flex items-center gap-1 text-sm text-admin-text-muted hover:text-admin-text">
            <ArrowLeft className="h-4 w-4" />
            Invoice Management
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-admin-text">
            {data?.invoiceNumber || 'Invoice'}
          </h2>
          <p className="text-sm text-admin-text-muted">
            {data?.customerName || 'Stored invoice page'}
            {data?.gstMode ? ` · ${data.gstMode === 'with' ? 'With GST' : 'Without GST'}` : ''}
          </p>
        </div>
        {data?.orderId ? (
          <Link to={`/admin/orders/${data.orderId}`}>
            <Button variant="outline" size="sm">
              Open order
            </Button>
          </Link>
        ) : null}
      </div>

      {isLoading ? <p className="text-sm text-admin-text-muted">Loading invoice page…</p> : null}
      {isError ? <p className="text-sm text-red-700">This invoice page could not be loaded.</p> : null}
      {data?.html ? (
        <OrderInvoicePanel
          html={data.html}
          orderNumber={data.invoiceNumber}
          stored
          savedAt={data.updatedAt}
        />
      ) : null}
    </div>
  )
}
