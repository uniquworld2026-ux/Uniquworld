import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Package,
  ShoppingCart,
  Store,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { AdminPageStats } from '@/admin/components/crud/AdminPageStats'
import { erpApi } from '@/admin/lib/erpApi'
import { formatCurrency } from '@/shared/lib/utils'
import { cn } from '@/shared/utils/cn'

function KpiCard({ item, index }) {
  const Icon = item.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.28 }}
      className="rounded-xl border border-admin-border bg-admin-elevated px-3.5 py-3 shadow-admin"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-admin-text-muted">
            {item.label}
          </p>
          <p className="mt-1 truncate text-xl font-semibold tracking-tight text-admin-text">
            {item.value}
          </p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-admin-sidebar-active-bg text-admin-accent">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>
      {item.hint ? (
        <p className="mt-1.5 truncate text-[11px] text-admin-text-muted">{item.hint}</p>
      ) : null}
    </motion.div>
  )
}

function Panel({ title, icon: Icon, children, action }) {
  return (
    <div className="rounded-2xl border border-admin-border bg-admin-elevated shadow-admin">
      <div className="flex items-center justify-between border-b border-admin-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          {Icon ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-muted text-admin-accent">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <h3 className="text-sm font-semibold text-admin-text">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['erp', 'dashboard'],
    queryFn: () => erpApi.dashboard(),
  })

  const kpis = data?.kpis || {}
  const latestOrders = data?.latestOrders || []
  const lowStock = data?.lowStock || []
  const activities = data?.activities || []

  const statCards = [
    {
      label: 'Revenue',
      value: formatCurrency(kpis.revenue || 0),
      hint: `Paid ${formatCurrency(kpis.paidAmount || 0)}`,
      icon: TrendingUp,
    },
    {
      label: 'Orders',
      value: kpis.orders ?? 0,
      hint: 'All storefront orders',
      icon: ShoppingCart,
    },
    {
      label: 'Products',
      value: kpis.products ?? 0,
      hint: `${kpis.publishedProducts ?? 0} published`,
      icon: Package,
    },
    {
      label: 'Customers',
      value: kpis.customers ?? 0,
      hint: 'Registered accounts',
      icon: Users,
    },
  ]

  const secondaryStats = [
    { label: 'Shipments', value: kpis.shipments ?? 0, hint: 'Delivery records', tone: 'accent', icon: Truck },
    { label: 'Low stock', value: kpis.lowStock ?? 0, hint: 'Inventory alerts', tone: kpis.lowStock ? 'warning' : 'success', icon: AlertTriangle },
    { label: 'Store products', value: kpis.storeProducts ?? 0, hint: 'Published on /store', tone: 'default', icon: Store },
    { label: 'Inventory SKUs', value: kpis.inventoryItems ?? 0, hint: 'Warehouse items', tone: 'default', icon: Package },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-admin-text sm:text-2xl">Dashboard</h2>
        <p className="mt-1 text-sm text-admin-text-muted">
          Live ERP summary from orders, catalog, inventory, and customers.
        </p>
      </div>

      {isError ? (
        <p className="rounded-xl border border-admin-danger/30 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
          {error?.message || 'Failed to load dashboard'}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {statCards.map((item, index) => (
          <KpiCard key={item.label} item={item} index={index} />
        ))}
      </div>

      <AdminPageStats stats={secondaryStats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Latest orders"
          icon={ShoppingCart}
          action={
            <Link to="/admin/orders" className="text-xs font-medium text-admin-accent hover:underline">
              View all
            </Link>
          }
        >
          {isLoading ? (
            <p className="text-sm text-admin-text-muted">Loading…</p>
          ) : latestOrders.length === 0 ? (
            <p className="text-sm text-admin-text-muted">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {latestOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-admin-text">{order.orderNumber}</p>
                    <p className="truncate text-xs text-admin-text-muted">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-admin-text">{formatCurrency(order.total)}</p>
                    <Badge tone="default">{order.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Low stock"
          icon={AlertTriangle}
          action={
            <Link to="/admin/inventory" className="text-xs font-medium text-admin-accent hover:underline">
              Inventory
            </Link>
          }
        >
          {isLoading ? (
            <p className="text-sm text-admin-text-muted">Loading…</p>
          ) : lowStock.length === 0 ? (
            <p className="text-sm text-admin-text-muted">No low-stock alerts.</p>
          ) : (
            <ul className="space-y-3">
              {lowStock.map((item) => (
                <li key={item.sku} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-admin-text">{item.name}</p>
                    <p className="truncate text-xs text-admin-text-muted">
                      {item.sku} · {item.warehouse}
                    </p>
                  </div>
                  <span className="font-semibold text-admin-danger">{item.qty}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Recent activity" icon={ArrowUpRight}>
        {activities.length === 0 ? (
          <p className="text-sm text-admin-text-muted">No recent shipment activity.</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((item, i) => (
              <li key={i} className="flex items-start justify-between gap-3 text-sm">
                <p className="text-admin-text">{item.text}</p>
                <span className="shrink-0 text-xs text-admin-text-muted">
                  {item.time ? new Date(item.time).toLocaleString() : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/admin/shipping"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-admin-accent"
        >
          Shipping & delivery <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Panel>
    </div>
  )
}
