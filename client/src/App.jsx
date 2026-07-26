import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@/app/providers/AppProviders'
import { AppRouter } from '@/app/router'
import { ScrollToTop } from '@/app/ScrollToTop'

/**
 * Application root — providers + router.
 */
export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
      </BrowserRouter>
    </AppProviders>
  )
}
