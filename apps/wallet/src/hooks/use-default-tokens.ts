import { useQuery } from '@tanstack/react-query'

// todo: export trpc client with api router and used instead
// todo: cache
const useDefaultTokens = (enabled: boolean) => {
  return useQuery({
    queryKey: ['assets'],
    enabled,
    queryFn: async () => {
      // todo use correct api
      const url = new URL('http://localhost:3030/api/trpc/assets.all')
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address: '0x82Afa2C4A686AF9344E929F9821F3e8c6E9293aB',
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

      return {
        defaultTokens: body.result.data.json.assets,
        defaultSummary: body.result.data.json.summary,
      }
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export { useDefaultTokens }
