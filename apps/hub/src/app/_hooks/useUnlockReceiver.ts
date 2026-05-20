import { useQuery } from '@tanstack/react-query'
import { parseAbiItem } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'

import type { Vault } from '~constants/index'
import type { Address } from 'viem'

const WITHDRAW_EVENT = parseAbiItem(
  'event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)'
)

/**
 * Resolves the receiver from the depositor's most recent on-chain Withdraw
 * event on this vault. Returns null if the connected address has never
 * unlocked from this vault.
 */
export function useUnlockReceiver({ vault }: { vault: Vault }) {
  const { address } = useAccount()
  const publicClient = usePublicClient({ chainId: vault.chainId })

  const { data: receiver = null } = useQuery({
    queryKey: [
      'vault-unlock-receiver',
      vault.chainId,
      vault.address,
      address?.toLowerCase(),
    ],
    enabled: !!address && !!publicClient,
    queryFn: async (): Promise<Address | null> => {
      if (!address || !publicClient) return null

      const logs = await publicClient.getLogs({
        address: vault.address,
        event: WITHDRAW_EVENT,
        args: { owner: address },
        fromBlock: 'earliest',
        toBlock: 'latest',
      })

      if (logs.length === 0) return null

      const latest = logs.reduce((acc, log) => {
        if (!acc) return log
        if (log.blockNumber > acc.blockNumber) return log
        if (log.blockNumber === acc.blockNumber && log.logIndex > acc.logIndex)
          return log
        return acc
      })

      return latest.args.receiver ?? null
    },
  })

  return { receiver }
}
