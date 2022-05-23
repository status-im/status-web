import React, { createContext, useContext, useMemo } from 'react'

import type { Config } from '~/src/types/config'
// import { createClient } from '@status-im/js'
// import type { Client } from '@status-im/js'

interface ClientContext {
  client: Config
}

const Context = createContext<ClientContext | undefined>(undefined)

export function useClient() {
  const context = useContext(Context)

  if (!context) {
    throw new Error(`useClient must be used within a ClientProvider`)
  }

  return context
}

interface ClientProviderProps {
  config: Config
  children: React.ReactNode
}

export const ClientProvider = (props: ClientProviderProps) => {
  const { config, children } = props

  const client = useMemo(() => {
    // return createClient({ ...config })
    return { client: config }
  }, [config])

  return <Context.Provider value={client}>{children}</Context.Provider>
}
