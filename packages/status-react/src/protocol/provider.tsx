import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { createClient } from '@status-im/js'

import { Loading } from '~/src/components/loading'

import type { Account, Client, ClientOptions, Community } from '@status-im/js'
import type { Config } from '~/src/types/config'

const Context = createContext<Client | undefined>(undefined)
const CommunityContext = createContext<
  Community['communityMetadata'] | undefined
>(undefined)

export function useClient() {
  const context = useContext(Context)

  if (!context) {
    throw new Error(`useClient must be used within a ClientProvider`)
  }

  return context
}

export function useCommunity() {
  const context = useContext(CommunityContext)

  if (!context) {
    // return {}
    throw new Error(`useCommunity must be used within a ClientProvider`)
  }

  return context
}

interface ClientProviderProps {
  options: ClientOptions
  children: React.ReactNode
}

export const ClientProvider = (props: ClientProviderProps) => {
  const [client, setClient] = useState<Client>()
  const [community, setCommunity] = useState<Community['communityMetadata']>()
  const [account, setAccount] = useState<Account>()
  const [loading, setLoading] = useState(true)

  const { options, children } = props

  // const client = useMemo(() => {
  //   return createClient(options)
  // }, [options])

  useEffect(() => {
    const loadClient = async () => {
      // setLoading(true)
      const client = await createClient({ publicKey: props.options.publicKey })
      console.log('init', client)
      setCommunity(client.community.communityMetadata)
      console.log(
        'file: provider.tsx > line 64 > loadClient > client.community.communityMetadata',
        client.community.communityMetadata
      )

      setClient(client)
      setLoading(false)
    }

    loadClient()
  }, [])

  useEffect(() => {
    if (client) {
      console.log('useEffect subscribe')
      return client.community.onCommunityUpdate(community => {
        setCommunity(community)
        console.log(
          'file: provider.tsx > line 75 > useEffect > community',
          community
        )
      })
    }
  }, [client])

  // if (!client) {
  //   return
  // }

  return (
    <Context.Provider value={client}>
      <CommunityContext.Provider value={community}>
        {loading ? <Loading /> : children}
      </CommunityContext.Provider>
    </Context.Provider>
  )
}
