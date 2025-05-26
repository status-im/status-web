import { useQuery } from '@tanstack/react-query'

// todo: export trpc client with api router and used instead
// todo: cache
const useAssets = () => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const url = new URL('http://localhost:3030/api/trpc/assets.all')
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            networks: [
              'ethereum',
              'optimism',
              'arbitrum',
              'base',
              'polygon',
              'bsc',
            ],
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
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export { useAssets }
