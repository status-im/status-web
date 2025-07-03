import { useQuery } from '@tanstack/react-query'

type Props = {
  isWalletLoading: boolean
  address?: string
}

// todo: export trpc client with api router and used instead
// todo: cache
const useAssets = (props: Props) => {
  const { address, isWalletLoading } = props

  return useQuery({
    queryKey: ['assets', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('No wallet address available')
      }

      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/assets.all`,
      )
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address,
            networks: [
              'ethereum',
              'optimism',
              'arbitrum',
              'base',
              'polygon',
              'bsc',
              'sepolia',
            ],
            // Uncomment the line below to include timestamp in the request and force a fresh fetch
            // This can be useful for debugging or ensuring the latest data is fetched
            // _timestamp: Date.now(),
          },
        }),
      )

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch.')
      }

      const body = await response.json()

      return body.result.data.json.assets
    },
    enabled: !!address && !isWalletLoading,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export { useAssets }
