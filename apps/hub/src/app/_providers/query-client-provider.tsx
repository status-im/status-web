'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import type React from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
})

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
