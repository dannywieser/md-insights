import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { configureCacheClient } from '@md-insights/api-client/cache'
import { App } from './App'
import { createQueryClient } from './query-client'
import './index.css'

configureCacheClient({ baseUrl: import.meta.env.VITE_CACHE_URL ?? 'http://localhost:8787' })
const queryClient = createQueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
