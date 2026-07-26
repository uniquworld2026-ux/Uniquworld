import { Download, FileBarChart } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { formatCurrency } from '@/shared/lib/utils'

const reports = [
  {
    id: 'sales',
    title: 'Sales summary',
    description: 'Revenue, orders, and AOV for the selected period.',
    metric: formatCurrency(428900),
    metricLabel: 'Last 30 days',
  },
  {
    id: 'inventory',
    title: 'Inventory valuation',
    description: 'On-hand stock value by warehouse and category.',
    metric: formatCurrency(1864200),
    metricLabel: 'Current',
  },
  {
    id: 'customers',
    title: 'Customer retention',
    description: 'Repeat purchase rate and cohort return window.',
    metric: '34%',
    metricLabel: 'Repeat rate',
  },
  {
    id: 'corporate',
    title: 'Corporate pipeline',
    description: 'Open enquiries and quoted value by stage.',
    metric: formatCurrency(612500),
    metricLabel: 'Open quotes',
  },
]

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">
          Reports
        </h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          Export operational summaries for finance and merchandising.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <article
            key={report.id}
            className="rounded-2xl border border-admin-border bg-admin-elevated p-5 shadow-admin"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-admin-muted p-2.5 text-admin-accent">
                <FileBarChart className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-admin-text">{report.title}</h3>
                <p className="mt-1 text-sm text-admin-text-muted">{report.description}</p>
                <p className="mt-4 text-2xl font-semibold tracking-tight text-admin-text">
                  {report.metric}
                </p>
                <p className="text-xs text-admin-text-muted">{report.metricLabel}</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
