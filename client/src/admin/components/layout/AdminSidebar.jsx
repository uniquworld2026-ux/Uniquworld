import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { adminNavigation } from '@/admin/config/navigation'
import { useSidebar } from '@/admin/context/SidebarContext'
import { cn } from '@/shared/utils/cn'

function BrandMark({ collapsed }) {
  return (
    <div className={cn('flex items-center gap-3 px-3', collapsed && 'justify-center px-0')}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-admin-sidebar-active/20 ring-1 ring-admin-sidebar-active/30">
        <span className="font-display text-lg font-semibold text-admin-sidebar-active">U</span>
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="min-w-0"
          >
            <p className="font-display text-xl leading-none tracking-tight text-admin-sidebar-text">
              Uniquworld
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-admin-sidebar-muted">
              Admin ERP
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function NavItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-admin-sidebar-active/15 text-admin-sidebar-active'
            : 'text-admin-sidebar-muted hover:bg-white/5 hover:text-admin-sidebar-text',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="admin-nav-indicator"
              className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-admin-sidebar-active"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Icon
            className={cn(
              'h-[18px] w-[18px] shrink-0 transition-colors',
              isActive ? 'text-admin-sidebar-active' : 'text-admin-sidebar-muted group-hover:text-admin-sidebar-text',
            )}
            strokeWidth={1.75}
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ collapsed, onNavigate, onCloseMobile }) {
  const { toggleCollapsed } = useSidebar()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-3">
        <BrandMark collapsed={collapsed} />
        <button
          type="button"
          onClick={onCloseMobile}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-admin-sidebar-muted hover:bg-white/5 hover:text-admin-sidebar-text lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="admin-scrollbar flex-1 overflow-y-auto px-2.5 py-4">
        {adminNavigation.map((group) => (
          <div key={group.id} className="mb-5">
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-admin-sidebar-muted/70">
                {group.label}
              </p>
            )}
            {collapsed && <div className="mb-2 mx-auto h-px w-6 bg-white/8" />}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <NavItem item={item} collapsed={collapsed} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3">
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            'hidden w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-medium',
            'text-admin-sidebar-muted transition-colors hover:bg-white/5 hover:text-admin-sidebar-text lg:flex',
            collapsed && 'justify-center px-2',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

/**
 * Admin ERP Sidebar — desktop collapsible + mobile drawer.
 */
export function AdminSidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar()

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col bg-admin-sidebar transition-[width] duration-300 ease-out lg:flex',
          collapsed ? 'w-[72px]' : 'w-[260px]',
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
              aria-hidden
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[min(280px,92vw)] bg-admin-sidebar pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] lg:hidden"
            >
              <SidebarContent collapsed={false} onNavigate={closeMobile} onCloseMobile={closeMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
