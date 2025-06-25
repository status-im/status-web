import { useQuery } from '@tanstack/react-query'

// todo: export trpc client with api router and used instead
// todo: cache
const useAssets = (address: string) => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const url = new URL('http://localhost:3030/api/trpc/assets.all')
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
