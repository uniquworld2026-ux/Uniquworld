import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { SidebarProvider, useSidebar } from '@/admin/context/SidebarContext'
import { adminFlatNav } from '@/admin/config/navigation'
import { cn } from '@/shared/utils/cn'

function resolvePageMeta(pathname) {
  const exact = adminFlatNav.find((item) => item.path === pathname)
  if (exact) {
    return {
      title: exact.label,
      subtitle: `Uniquworld / ${exact.label}`,
    }
  }

  const nested = adminFlatNav.find(
    (item) => item.path !== '/admin' && pathname.startsWith(item.path),
  )
  if (nested) {
    return {
      title: nested.label,
      subtitle: `Uniquworld / ${nested.label}`,
    }
  }

  return {
    title: 'Dashboard',
    subtitle: 'Uniquworld commerce operations overview',
  }
}

function AdminShell() {
  const { collapsed, closeMobile } = useSidebar()
  const location = useLocation()
  const meta = resolvePageMeta(location.pathname)

  useEffect(() => {
    closeMobile()
  }, [location.pathname, closeMobile])

  return (
    <div className="admin-shell min-h-svh bg-admin-bg text-admin-text">
      <AdminSidebar />

      <div
        className={cn(
          'flex min-h-svh flex-col transition-[padding] duration-300 ease-out',
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]',
        )}
      >
        <AdminHeader title={meta.title} subtitle={meta.subtitle} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

/**
 * Root admin layout — sidebar + header + page outlet.
 */
export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminShell />
    </SidebarProvider>
  )
}
