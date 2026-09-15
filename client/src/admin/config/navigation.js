import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Receipt,
  Users,
  Building2,
  FileText,
  Gift,
  Star,
  Ticket,
  Image,
  Images,
  Newspaper,
  PanelsTopLeft,
  Bell,
  BarChart3,
  LineChart,
  Settings,
  Shield,
  ScrollText,
  Truck,
  Warehouse,
  Store,
  CreditCard,
  Handshake,
  ShoppingBag,
  UserCog,
  Boxes,
  Contact,
  Wrench,
  ClipboardCheck,
} from 'lucide-react'

/**
 * Admin sidebar navigation — Uniquworld ERP.
 * path values map to React Router routes under /admin.
 */
export const adminNavigation = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin',
        icon: LayoutDashboard,
        end: true,
      },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    items: [
      {
        id: 'products',
        label: 'Product Management',
        path: '/admin/products',
        icon: Package,
      },
      {
        id: 'categories',
        label: 'Category Management',
        path: '/admin/categories',
        icon: Layers,
      },
      {
        id: 'purchases',
        label: 'Purchase Management',
        path: '/admin/purchases',
        icon: ShoppingBag,
      },
      {
        id: 'suppliers',
        label: 'Supplier Management',
        path: '/admin/suppliers',
        icon: Contact,
      },
      {
        id: 'vendors',
        label: 'Vendor Management',
        path: '/admin/vendors',
        icon: Handshake,
      },
      {
        id: 'vendor-services',
        label: 'Service Management',
        path: '/admin/vendor-services',
        icon: Wrench,
      },
      {
        id: 'inventory',
        label: 'Inventory Management',
        path: '/admin/inventory',
        icon: Warehouse,
      },
      {
        id: 'fulfillment',
        label: 'Office Fulfillment',
        path: '/admin/fulfillment',
        icon: ClipboardCheck,
      },
      {
        id: 'stores',
        label: 'Store Management',
        path: '/admin/stores',
        icon: Store,
      },
      {
        id: 'store-products',
        label: 'Store Products',
        path: '/admin/store-products',
        icon: Boxes,
      },
      {
        id: 'store-withdrawals',
        label: 'Store Withdrawals',
        path: '/admin/store-withdrawals',
        icon: CreditCard,
      },
    ],
  },
  {
    id: 'erp',
    label: 'ERP',
    items: [
      {
        id: 'orders',
        label: 'Order Management',
        path: '/admin/orders',
        icon: ShoppingCart,
      },
      {
        id: 'invoice-generator',
        label: 'Invoice Generator',
        path: '/admin/invoice-generator',
        icon: Receipt,
      },
      {
        id: 'payments',
        label: 'Payment Management',
        path: '/admin/payments',
        icon: CreditCard,
      },
      {
        id: 'shipping',
        label: 'Shipping & Delivery',
        path: '/admin/shipping',
        icon: Truck,
      },
      {
        id: 'customers',
        label: 'Customer Management',
        path: '/admin/customers',
        icon: Users,
      },
      {
        id: 'admin-users',
        label: 'Admin User Management',
        path: '/admin/admin-users',
        icon: UserCog,
      },
    ],
  },
  {
    id: 'commerce',
    label: 'Commerce',
    items: [
      {
        id: 'corporate',
        label: 'Corporate Enquiries',
        path: '/admin/corporate-enquiries',
        icon: Building2,
      },
      {
        id: 'quotations',
        label: 'Quotation Management',
        path: '/admin/quotations',
        icon: FileText,
      },
      {
        id: 'personalized',
        label: 'Personalized Orders',
        path: '/admin/personalized-orders',
        icon: Gift,
      },
      {
        id: 'reviews',
        label: 'Reviews',
        path: '/admin/reviews',
        icon: Star,
      },
      {
        id: 'coupons',
        label: 'Coupons',
        path: '/admin/coupons',
        icon: Ticket,
      },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    items: [
      {
        id: 'banners',
        label: 'Banner Management',
        path: '/admin/banners',
        icon: Image,
      },
      {
        id: 'media',
        label: 'Media Library',
        path: '/admin/media',
        icon: Images,
      },
      {
        id: 'blog',
        label: 'Blog',
        path: '/admin/blog',
        icon: Newspaper,
      },
      {
        id: 'cms',
        label: 'CMS',
        path: '/admin/cms',
        icon: PanelsTopLeft,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        path: '/admin/notifications',
        icon: Bell,
      },
    ],
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        path: '/admin/reports',
        icon: BarChart3,
      },
      {
        id: 'analytics',
        label: 'Analytics',
        path: '/admin/analytics',
        icon: LineChart,
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        path: '/admin/settings',
        icon: Settings,
      },
      {
        id: 'roles',
        label: 'Role Management',
        path: '/admin/roles',
        icon: Shield,
      },
      {
        id: 'audit',
        label: 'Audit Logs',
        path: '/admin/audit-logs',
        icon: ScrollText,
      },
    ],
  },
]

export const adminFlatNav = adminNavigation.flatMap((group) => group.items)

/** @deprecated Prefer adminNavigation — alias for Step 1 compatibility */
export const adminNavGroups = adminNavigation
