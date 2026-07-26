import { Line, Bar } from 'react-chartjs-2'
import '@/admin/components/widgets/chartSetup'
import { chartDefaults, getChartColors } from '@/admin/components/widgets/chartSetup'
import { formatCurrency } from '@/shared/lib/utils'

const colors = getChartColors(false)

const kpis = [
  { label: 'Sessions', value: '48.2k', change: '+12%' },
  { label: 'Conversion', value: '3.4%', change: '+0.4%' },
  { label: 'Revenue', value: formatCurrency(428900), change: '+18%' },
  { label: 'Avg. order', value: formatCurrency(2460), change: '+6%' },
]

const trafficData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Sessions',
      data: [5200, 6100, 5800, 7200, 6900, 8400, 7600],
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
      fill: true,
      tension: 0.35,
    },
  ],
}

const categoryData = {
  labels: ['Home Décor', 'Corporate', 'Personalized', 'Jewellery'],
  datasets: [
    {
      label: 'Orders',
      data: [186, 94, 128, 42],
      backgroundColor: [colors.success, colors.accent, colors.info, colors.warning],
      borderRadius: 8,
    },
  ],
}

const chartOptions = {
  ...chartDefaults,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: colors.text } },
    y: { grid: { color: colors.grid }, ticks: { color: colors.text } },
  },
}

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
          Analytics
        </h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          Storefront performance for the last 7 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-admin-border bg-admin-elevated p-4 shadow-admin"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-admin-text-muted">
              {kpi.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-admin-text">{kpi.value}</p>
            <p className="mt-1 text-xs text-admin-success">{kpi.change} vs prior week</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin">
          <h3 className="text-sm font-semibold text-admin-text">Traffic</h3>
          <div className="mt-4 h-64">
            <Line data={trafficData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin">
          <h3 className="text-sm font-semibold text-admin-text">Orders by category</h3>
          <div className="mt-4 h-64">
            <Bar data={categoryData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
