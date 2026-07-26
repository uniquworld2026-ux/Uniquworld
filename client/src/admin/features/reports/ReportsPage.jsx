import { useQuery } from '@tanstack/react-query'
import { Building2, Download, Package, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { AdminPageStats } from '@/admin/components/crud/AdminPageStats'
import { erpApi } from '@/admin/lib/erpApi'
import { formatCurrency } from '@/shared/lib/utils'

export function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['erp', 'dashboard'],
    queryFn: () => erpApi.dashboard(),
  })
  const kpis = data?.kpis || {}

  const reports = [
    {
      id: 'sales',
      title: 'Sales summary',
      description: 'Revenue and order volume from live orders.',
      metric: formatCurrency(kpis.revenue || 0),
      metricLabel: `${kpis.orders ?? 0} orders`,
    },
    {
      id: 'inventory',
      title: 'Inventory health',
      description: 'Warehouse SKUs and low-stock alerts.',
      metric: String(kpis.inventoryItems ?? 0),
      metricLabel: `${kpis.lowStock ?? 0} low stock`,
    },
    {
      id: 'customers',
      title: 'Customer base',
      description: 'Registered storefront customers.',
      metric: String(kpis.customers ?? 0),
      metricLabel: 'Accounts',
    },
    {
      id: 'fulfillment',
      title: 'Fulfillment',
      description: 'Shipments created for deliveries.',
      metric: String(kpis.shipments ?? 0),
      metricLabel: 'Shipments',
    },
  ]

  function exportSummary() {
    const rows = [
      ['metric', 'value'],
      ['revenue', kpis.revenue ?? 0],
      ['orders', kpis.orders ?? 0],
      ['customers', kpis.customers ?? 0],
      ['products', kpis.products ?? 0],
      ['inventory_items', kpis.inventoryItems ?? 0],
      ['low_stock', kpis.lowStock ?? 0],
      ['shipments', kpis.shipments ?? 0],
      ['store_products', kpis.storeProducts ?? 0],
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `erp-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
            Reports
          </h2>
          <p className="mt-1 text-sm text-admin-text-muted">
            Live operational summaries from the ERP database.
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-9" onClick={exportSummary} disabled={isLoading}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <AdminPageStats
        stats={[
          {
            label: 'Sales',
            value: isLoading ? '…' : formatCurrency(kpis.revenue || 0),
            hint: 'Order revenue',
            tone: 'accent',
            icon: TrendingUp,
          },
          {
            label: 'Inventory',
            value: isLoading ? '…' : kpis.inventoryItems ?? 0,
            hint: 'SKUs tracked',
            tone: 'default',
            icon: Package,
          },
          {
            label: 'Customers',
            value: isLoading ? '…' : kpis.customers ?? 0,
            hint: 'Registered',
            tone: 'success',
            icon: Users,
          },
          {
            label: 'Shipments',
            value: isLoading ? '…' : kpis.shipments ?? 0,
            hint: 'Delivery records',
            tone: 'warning',
            icon: Building2,
          },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <article
            key={report.id}
            className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin"
          >
            <h3 className="font-medium text-admin-text">{report.title}</h3>
            <p className="mt-1 text-sm text-admin-text-muted">{report.description}</p>
            <p className="mt-4 text-2xl font-semibold text-admin-text">{report.metric}</p>
            <p className="mt-1 text-xs text-admin-text-muted">{report.metricLabel}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
