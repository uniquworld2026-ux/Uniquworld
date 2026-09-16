import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, FileText, Plus } from 'lucide-react'
import { erpApi } from '@/admin/lib/erpApi'
import { InvoiceBankForm } from '@/admin/components/commerce/InvoiceBankButton'
import { Button } from '@/shared/components/ui/Button'
import { formatCurrency } from '@/shared/lib/utils'

function formatWhen(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function InvoiceManagementPage() {
  const qc = useQueryClient()
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['erp', 'commerce', 'invoices'],
    queryFn: () => erpApi.listInvoices(),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-admin-accent">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Billing</span>
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-admin-text">Invoice Management</h2>
          <p className="mt-1 max-w-2xl text-sm text-admin-text-muted">
            Each saved invoice has its own page. Order invoices appear after you generate them. Manual invoices are stored from Invoice Generator.
          </p>
        </div>
        <Link to="/admin/invoice-generator">
          <Button variant="accent">
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        </Link>
      </div>

      <InvoiceBankForm
        onSaved={() => qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'invoices'] })}
      />

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-elevated">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-admin-border bg-admin-bg text-xs uppercase tracking-wide text-admin-text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">GST</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Saved</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-admin-text-muted">
                  Loading invoices…
                </td>
              </tr>
            ) : null}
            {isError ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-red-700">
                  Could not load invoices.
                </td>
              </tr>
            ) : null}
            {!isLoading && !isError && data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-admin-text-muted">
                  No invoices stored yet. Generate one and save it to create its page.
                </td>
              </tr>
            ) : null}
            {data.map((invoice) => (
              <tr key={`${invoice.source}-${invoice.id}`} className="border-b border-admin-border last:border-0">
                <td className="px-4 py-3 font-medium text-admin-text">{invoice.invoiceNumber}</td>
                <td className="px-4 py-3 text-admin-text-muted">
                  <div>{invoice.customerName}</div>
                  {invoice.orderNumber ? (
                    <div className="text-xs">Order {invoice.orderNumber}</div>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-admin-text-muted">
                  {invoice.source === 'order' ? 'Order' : 'Manual'}
                </td>
                <td className="px-4 py-3 text-admin-text-muted">
                  {invoice.gstMode === 'with' ? 'With GST' : 'Without GST'}
                </td>
                <td className="px-4 py-3 text-admin-text">{formatCurrency(invoice.totalAmount)}</td>
                <td className="px-4 py-3 text-admin-text-muted">{formatWhen(invoice.updatedAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/invoices/${invoice.source}/${invoice.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3.5 w-3.5" />
                      Open page
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
