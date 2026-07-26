import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/shared/hooks/useTheme'
import { AdminAuthProvider } from '@/admin/auth/AdminAuthContext'
import { CustomerAuthProvider } from '@/storefront/auth/CustomerAuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CustomerAuthProvider>
          <AdminAuthProvider>{children}</AdminAuthProvider>
        </CustomerAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
