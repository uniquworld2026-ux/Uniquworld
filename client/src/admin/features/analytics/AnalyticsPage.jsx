import { useQuery } from '@tanstack/react-query'
import { Activity, Package, Percent, ShoppingBag, Users, Wallet } from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import '@/admin/components/widgets/chartSetup'
import { chartDefaults, getChartColors } from '@/admin/components/widgets/chartSetup'
import { AdminPageStats } from '@/admin/components/crud/AdminPageStats'
import { erpApi } from '@/admin/lib/erpApi'
import { formatCurrency } from '@/shared/lib/utils'

const colors = getChartColors(false)

const chartOptions = {
  ...chartDefaults,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: colors.text } },
    y: { grid: { color: colors.grid }, ticks: { color: colors.text } },
  },
}

export function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['erp', 'dashboard'],
    queryFn: () => erpApi.dashboard(),
  })
  const ordersQuery = useQuery({
    queryKey: ['erp', 'commerce', 'orders'],
    queryFn: () => erpApi.listOrders({ limit: 100 }),
  })

  const kpis = data?.kpis || {}
  const orders = ordersQuery.data || []

  const byDay = {}
  orders.forEach((o) => {
    const day = new Date(o.createdAt || o.updatedAt || Date.now()).toLocaleDateString('en-IN', {
      weekday: 'short',
    })
    byDay[day] = (byDay[day] || 0) + 1
  })
  const dayLabels = Object.keys(byDay)
  const dayValues = Object.values(byDay)

  const statusCounts = {}
  orders.forEach((o) => {
    const s = o.status || 'pending'
    statusCounts[s] = (statusCounts[s] || 0) + 1
  })

  const trafficData = {
    labels: dayLabels.length ? dayLabels : ['—'],
    datasets: [
      {
        label: 'Orders',
        data: dayValues.length ? dayValues : [0],
        borderColor: colors.accent,
        backgroundColor: colors.accentSoft,
        fill: true,
        tension: 0.35,
      },
    ],
  }

  const categoryData = {
    labels: Object.keys(statusCounts).length ? Object.keys(statusCounts) : ['none'],
    datasets: [
      {
        label: 'Orders',
        data: Object.keys(statusCounts).length ? Object.values(statusCounts) : [0],
        backgroundColor: [colors.success, colors.accent, colors.info, colors.warning, colors.danger],
        borderRadius: 8,
      },
    ],
  }

  const avgOrder =
    kpis.orders > 0 ? Number(kpis.revenue || 0) / Number(kpis.orders) : 0

  const stats = [
    {
      label: 'Orders',
      value: isLoading ? '…' : kpis.orders ?? 0,
      hint: 'Live from ERP',
      tone: 'accent',
      icon: ShoppingBag,
    },
    {
      label: 'Revenue',
      value: isLoading ? '…' : formatCurrency(kpis.revenue || 0),
      hint: 'Order totals',
      tone: 'success',
      icon: Wallet,
    },
    {
      label: 'Customers',
      value: isLoading ? '…' : kpis.customers ?? 0,
      hint: 'Registered',
      tone: 'default',
      icon: Users,
    },
    {
      label: 'Avg. order',
      value: isLoading ? '…' : formatCurrency(avgOrder),
      hint: 'Revenue / orders',
      tone: 'accent',
      icon: Percent,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
          Analytics
        </h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          Live ERP metrics — orders, revenue, and customers from the database.
        </p>
      </div>

      <AdminPageStats stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin">
          <h3 className="text-sm font-semibold text-admin-text">Orders by day</h3>
          <div className="mt-4 h-64">
            <Line data={trafficData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin">
          <h3 className="text-sm font-semibold text-admin-text">Orders by status</h3>
          <div className="mt-4 h-64">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin">
        <div className="flex items-center gap-2 text-sm text-admin-text-muted">
          <Package className="h-4 w-4" />
          Catalog products: {kpis.products ?? 0} · Store channel: {kpis.storeProducts ?? 0} ·
          Shipments: {kpis.shipments ?? 0}
        </div>
        <p className="mt-2 inline-flex items-center gap-1 text-xs text-admin-text-muted">
          <Activity className="h-3.5 w-3.5" />
          Charts refresh from live order records.
        </p>
      </div>
    </div>
  )
}
