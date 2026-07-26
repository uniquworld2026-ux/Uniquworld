import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Eye,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { RevenueChart, SalesChart, TopProductsChart } from '@/admin/components/widgets'
import { cn } from '@/shared/utils/cn'

const kpis = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: '₹12.4L',
    delta: '+12.4%',
    positive: true,
    icon: TrendingUp,
  },
  {
    id: 'orders',
    label: 'Orders',
    value: '1,284',
    delta: '+8.1%',
    positive: true,
    icon: ShoppingCart,
  },
  {
    id: 'products',
    label: 'Products',
    value: '846',
    delta: '+24',
    positive: true,
    icon: Package,
  },
  {
    id: 'customers',
    label: 'Customers',
    value: '5,921',
    delta: '+3.2%',
    positive: true,
    icon: Users,
  },
  {
    id: 'visitors',
    label: 'Visitors',
    value: '28.4K',
    delta: '−1.4%',
    positive: false,
    icon: Eye,
  },
]

const latestOrders = [
  { id: 'HM-10482', customer: 'Ananya R.', total: '₹4,280', status: 'Processing' },
  { id: 'HM-10481', customer: 'Vikram S.', total: '₹1,150', status: 'Shipped' },
  { id: 'HM-10480', customer: 'Meera K.', total: '₹8,990', status: 'Pending' },
  { id: 'HM-10479', customer: 'Corp — Nexa', total: '₹42,500', status: 'Quoted' },
]

const lowStock = [
  { name: 'Walnut Desk Organizer', sku: 'WD-204', qty: 4 },
  { name: 'Handwoven Gift Tray', sku: 'GT-118', qty: 6 },
  { name: 'Brass Candle Set', sku: 'BC-091', qty: 3 },
]

const activities = [
  { text: 'New corporate enquiry from Lumen Labs', time: '12 min ago' },
  { text: 'Quotation Q-229 approved', time: '41 min ago' },
  { text: 'Low stock alert: Brass Candle Set', time: '1 hr ago' },
  { text: 'Order HM-10478 marked delivered', time: '2 hr ago' },
]

function KpiCard({ item, index }) {
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="rounded-2xl border border-admin-border bg-admin-elevated p-4 shadow-admin sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-admin-text-muted">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-admin-text">{item.value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-admin-sidebar-active-bg text-admin-accent">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
      </div>
      <p
        className={cn(
          'mt-3 inline-flex items-center gap-1 text-xs font-medium',
          item.positive ? 'text-admin-success' : 'text-admin-danger',
        )}
      >
        <ArrowUpRight className={cn('h-3.5 w-3.5', !item.positive && 'rotate-90')} />
        {item.delta} vs last month
      </p>
    </motion.div>
  )
}

function Panel({ title, icon: Icon, children, action }) {
  return (
    <div className="rounded-2xl border border-admin-border bg-admin-elevated shadow-admin">
      <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          {Icon ? <Icon className="h-4 w-4 text-admin-accent" strokeWidth={1.75} /> : null}
          <h3 className="text-sm font-semibold text-admin-text">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

/**
 * Dashboard home — KPI shell + operational panels.
 * Chart.js widgets land in the next module.
 */
export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-admin-border bg-admin-elevated p-6 shadow-admin sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-admin-accent">
          Step 1 · Layout Ready
        </p>
        <h2 className="mt-2 font-display text-3xl tracking-tight text-admin-text sm:text-4xl">
          Admin ERP shell is live
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-admin-text-muted sm:text-base">
          Live Chart.js widgets for revenue and sales sit below. Manage catalog from Product
          Management, or preview the customer storefront.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-accent transition-opacity hover:opacity-80"
          >
            Product Management
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-admin-text-muted transition-opacity hover:text-admin-accent"
          >
            Customer storefront
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item, index) => (
          <KpiCard key={item.id} item={item} index={index} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Panel
            title="Revenue Graph"
            icon={TrendingUp}
            action={<Badge tone="accent">Live</Badge>}
          >
            <RevenueChart />
          </Panel>

          <Panel title="Sales Graph" icon={ShoppingCart} action={<Badge tone="info">Orders vs units</Badge>}>
            <SalesChart />
          </Panel>

          <Panel title="Latest Orders" icon={ShoppingCart}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-admin-border text-xs uppercase tracking-wider text-admin-text-muted">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.map((order) => (
                    <tr key={order.id} className="border-b border-admin-border/70 last:border-0">
                      <td className="py-3 font-medium text-admin-text">{order.id}</td>
                      <td className="py-3 text-admin-text-muted">{order.customer}</td>
                      <td className="py-3 text-admin-text">{order.total}</td>
                      <td className="py-3">
                        <Badge
                          tone={
                            order.status === 'Shipped'
                              ? 'success'
                              : order.status === 'Pending'
                                ? 'warning'
                                : 'info'
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Top Products" icon={Package} action={<Badge tone="accent">YTD</Badge>}>
            <TopProductsChart />
          </Panel>

          <Panel title="Pending Quotes" icon={FileText}>
            <div className="space-y-3">
              {[
                { name: 'Nexa Corp — Diwali kits', amount: '₹42,500' },
                { name: 'Orbit Soft — Welcome hampers', amount: '₹18,200' },
                { name: 'Aurelia — Wedding favours', amount: '₹27,900' },
              ].map((quote) => (
                <div
                  key={quote.name}
                  className="flex items-center justify-between gap-3 rounded-xl bg-admin-muted/50 px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-admin-text">{quote.name}</p>
                    <p className="text-xs text-admin-text-muted">Awaiting approval</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-admin-text">{quote.amount}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Low Stock" icon={AlertTriangle}>
            <ul className="space-y-3">
              {lowStock.map((item) => (
                <li key={item.sku} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-admin-text">{item.name}</p>
                    <p className="text-xs text-admin-text-muted">{item.sku}</p>
                  </div>
                  <Badge tone="danger">{item.qty} left</Badge>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Recent Activities" icon={Activity}>
            <ul className="space-y-4">
              {activities.map((item) => (
                <li key={item.text} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-admin-accent" />
                  <div>
                    <p className="text-sm text-admin-text">{item.text}</p>
                    <p className="mt-0.5 text-xs text-admin-text-muted">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
