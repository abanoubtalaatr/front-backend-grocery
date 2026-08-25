import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { appRouter } from '@/routes/router'
import { store } from '@/store/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

/** One client per app lifetime — creating this inside `App` would reset the cache every render. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Toaster
          position="top-center"
          closeButton
          richColors
          className="font-sans"
          toastOptions={{
            className: 'font-sans',
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        <RouterProvider router={appRouter} />
      </Provider>
    </QueryClientProvider>
  )
}
