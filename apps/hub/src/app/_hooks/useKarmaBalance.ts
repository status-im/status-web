import { getKarmaBalance, KARMA_CHAIN_IDS } from '@status-im/karma-sdk'
import { useQuery } from '@tanstack/react-query'
import { useAccount, usePublicClient } from 'wagmi'

const STALE_TIME = 30_000
const REFETCH_INTERVAL = 60_000

export function useKarmaBalance() {
  const { address } = useAccount()
  const publicClient = usePublicClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })

  return useQuery({
    queryKey: ['karma-balance', address],
    queryFn: async () => {
      if (!address || !publicClient) throw new Error('No address or client')

      const balance = await getKarmaBalance(publicClient as any, {
        account: address,
      })
      return { balance, account: address }
    },
    enabled: !!address && !!publicClient,
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
    retry: 3,
  })
}
