import { useCallback, useEffect, useState } from 'react'

import { createRequestClient } from '@status-im/js'

import type { ChannelInfo, CommunityInfo, UserInfo } from '@status-im/js'

type Client = Awaited<ReturnType<typeof createRequestClient>>

const useWaku = (
  publicKey: string | undefined
  // onReady: (client: Client) => Promise<void>
) => {
  const [client, setClient] = useState<Client>()

  useEffect(() => {
    if (!publicKey) {
      return
    }

    const load = async () => {
      const client = await createRequestClient({
        environment: 'test',
      })

      // onReady(client)
      setClient(client)
    }

    load()
  }, [publicKey])

  return client
}

// const client = useClient()

// const { data, isLoading, error } = useSWR(client ? 'channel' : null, () =>
//   client.fetchChannel()
// )
// const { data, isLoading, error } = useSWR(client ? 'community' : null, () =>
//   client.fetchCommunity()
// )

// import { useCallback, useEffect, useState } from 'react'

// import { useClient } from './use-client'

// import type { ChannelInfo, CommunityInfo, UserInfo } from '@status-im/js'

export function useWakuData<T extends CommunityInfo | ChannelInfo | UserInfo>(
  type: 'community' | 'channel' | 'profile',
  publicKey: string | undefined,
  channelUiid?: string
) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(true)

  const client = useWaku(publicKey)

  const fetch = useCallback(async () => {
    if (!client || !publicKey) {
      return
    }

    let promise
    switch (type) {
      case 'community': {
        promise = client.fetchCommunity(publicKey)
        break
      }
      case 'channel': {
        promise = client.fetchChannel(publicKey, channelUiid!)
        break
      }
      case 'profile':
        promise = client.fetchUser(publicKey)
        break
    }

    try {
      const data = await promise

      setData(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [type, client, publicKey])

  useEffect(() => {
    fetch()
  }, [fetch])

  const refetch = async () => {
    setLoading(true)
    fetch()
  }

  return { verifiedWakuData: data, error, loading, refetch }
}
