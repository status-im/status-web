import { queryOptions, useQuery } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useGetWallet = (walletId: string, password: string) => {
  const api = useAPI()

  const result = useQuery(
    queryOptions({
      enabled: Boolean(walletId && password),
      queryKey: ['get-wallet', walletId],
      queryFn: async () => {
        const { mnemonic } = await api.wallet.get.query({
          walletId,
          password,
        })

        return mnemonic
      },
      staleTime: 60 * 60 * 1000, // 1 hour
      gcTime: 60 * 60 * 1000, // 1 hour
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
  )

  return result
}
