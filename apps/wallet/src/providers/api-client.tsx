// todo?: use instead of query client and pass to router too
import { createContext, useContext } from 'react'

import { createAPIClient } from '../data/api'

export const apiClient = createAPIClient()

type Props = {
  children: React.ReactNode
}

const APIClientContext = createContext(apiClient)

export function useAPI() {
  const client = useContext(APIClientContext)

  if (!client) {
    throw new Error('useAPI must be used within a APIClientProvider')
  }

  return client
}

export function APIClientProvider(props: Props) {
  const { children } = props

  return (
    <APIClientContext.Provider value={apiClient}>
      {children}
    </APIClientContext.Provider>
  )
}
