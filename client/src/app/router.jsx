import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/admin/components/layout'
import { AdminDashboardPage } from '@/admin/pages/DashboardPage'
import { AdminPlaceholderPage } from '@/admin/pages/PlaceholderPage'
import { AdminLoginPage } from '@/admin/pages/AdminLoginPage'
import { RequireAdminAuth } from '@/admin/auth/RequireAdminAuth'
import { ProductsPage as AdminProductsPage } from '@/admin/features/products/ProductsPage'
import {
  ProductCreatePage,
  ProductEditPage,
} from '@/admin/features/products/ProductFormPages'
import { CategoriesPage as AdminCategoriesPage } from '@/admin/features/categories/CategoriesPage'
import { PurchasesPage } from '@/admin/features/purchases/PurchasesPage'
import { VendorsPage } from '@/admin/features/vendors/VendorsPage'
import { InventoryPage } from '@/admin/features/inventory/InventoryPage'
import { StoresPage } from '@/admin/features/stores/StoresPage'
import { StoreProductsPage } from '@/admin/features/stores/StoreProductsPage'
import { OrdersPage } from '@/admin/features/orders/OrdersPage'
import { PaymentsPage } from '@/admin/features/payments/PaymentsPage'
import { ShippingPage } from '@/admin/features/shipping/ShippingPage'
import { CustomersPage } from '@/admin/features/customers/CustomersPage'
import { AdminUsersPage } from '@/admin/features/admin-users/AdminUsersPage'
import { CorporateEnquiriesPage } from '@/admin/features/corporate/CorporateEnquiriesPage'
import { QuotationsPage } from '@/admin/features/quotations/QuotationsPage'
import { PersonalizedOrdersPage } from '@/admin/features/personalized/PersonalizedOrdersPage'
import { ReviewsPage } from '@/admin/features/reviews/ReviewsPage'
import { CouponsPage } from '@/admin/features/coupons/CouponsPage'
import { BannersPage } from '@/admin/features/banners/BannersPage'
import { MediaPage } from '@/admin/features/media/MediaPage'
import { CmsPage } from '@/admin/features/cms/CmsPage'
import { NotificationsPage } from '@/admin/features/notifications/NotificationsPage'
import { ReportsPage } from '@/admin/features/reports/ReportsPage'
import { AnalyticsPage } from '@/admin/features/analytics/AnalyticsPage'
import { SettingsPage } from '@/admin/features/settings/SettingsPage'
import { RolesPage } from '@/admin/features/roles/RolesPage'
import { AuditLogsPage } from '@/admin/features/audit/AuditLogsPage'
import { DesignSystemPage } from '@/storefront/pages/DesignSystemPage'
import { storefrontRouteTree } from '@/storefront/config/routes'
import { adminFlatNav } from '@/admin/config/navigation'

const implementedAdminPaths = new Set([
  '/admin',
  '/admin/products',
  '/admin/categories',
  '/admin/purchases',
  '/admin/vendors',
  '/admin/inventory',
  '/admin/stores',
  '/admin/store-products',
  '/admin/orders',
  '/admin/payments',
  '/admin/shipping',
  '/admin/customers',
  '/admin/admin-users',
  '/admin/corporate-enquiries',
  '/admin/quotations',
  '/admin/personalized-orders',
  '/admin/reviews',
  '/admin/coupons',
  '/admin/banners',
  '/admin/media',
  '/admin/cms',
  '/admin/notifications',
  '/admin/reports',
  '/admin/analytics',
  '/admin/settings',
  '/admin/roles',
  '/admin/audit-logs',
])

export function AppRouter() {
  const adminModuleRoutes = adminFlatNav.filter(
    (item) => !implementedAdminPaths.has(item.path),
  )

  return (
    <Routes>
      {storefrontRouteTree}

      <Route path="/design-system" element={<DesignSystemPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            <AdminLayout />
          </RequireAdminAuth>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<ProductCreatePage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="stores" element={<StoresPage />} />
        <Route path="store-products" element={<StoreProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="admin-users" element={<AdminUsersPage />} />
        <Route path="corporate-enquiries" element={<CorporateEnquiriesPage />} />
        <Route path="quotations" element={<QuotationsPage />} />
        <Route path="personalized-orders" element={<PersonalizedOrdersPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="banners" element={<BannersPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="cms" element={<CmsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        {adminModuleRoutes.map((item) => (
          <Route
            key={item.id}
            path={item.path.replace(/^\/admin\//, '')}
            element={<AdminPlaceholderPage title={item.label} />}
          />
        ))}
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
