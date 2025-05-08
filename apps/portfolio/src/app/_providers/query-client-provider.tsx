'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

type Props = {
  children: React.ReactNode
}

function _QueryClientProvider(props: Props) {
  const { children } = props

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export { _QueryClientProvider as QueryClientProvider }
