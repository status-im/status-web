import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type Props = {
  children: React.ReactNode
}

let queryClient: QueryClient | undefined

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 0,
          gcTime: 1000 * 60 * 60 * 24, // 24 hours
        },
      },
    })
  }

  return queryClient
}

function _QueryClientProvider(props: Props) {
  const { children } = props

  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
export { _QueryClientProvider as QueryClientProvider }
