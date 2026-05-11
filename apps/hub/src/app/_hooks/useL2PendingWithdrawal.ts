import { useAccount, useReadContract } from 'wagmi'
import { linea } from 'wagmi/chains'

import { L2ClaimVaultAbi } from '~constants/contracts/L2ClaimVaultAbi'

import type { Vault } from '~constants/index'

/**
 * Reads the pending withdrawal amount for the connected user on the L2 ClaimVault.
 */
export function useL2PendingWithdrawal({
  vault,
  poll = false,
}: {
  vault: Vault
  poll?: boolean
}) {
  const { address } = useAccount()

  return useReadContract({
    abi: L2ClaimVaultAbi,
    address: vault.l2ClaimVaultAddress,
    chainId: linea.id,
    functionName: 'pendingWithdrawal',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!vault.l2ClaimVaultAddress,
      refetchInterval: poll ? 30_000 : false,
    },
  })
}
