import { getRewardsBalance, KARMA_CHAIN_IDS } from '@status-im/karma-sdk'
import { useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient } from 'wagmi'

export function useKarmaRewardsDistributor() {
  const { address } = useAccount()
  const publicClient = usePublicClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })

  return useQuery({
    queryKey: ['karma-rewards-balance', address],
    queryFn: async () => {
      if (!address || !publicClient) throw new Error('No address or client')
      const balance = await getRewardsBalance(publicClient, {
        account: address,
      })
      return { balance, account: address }
    },
    enabled: !!address && !!publicClient,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 3,
  })
}
