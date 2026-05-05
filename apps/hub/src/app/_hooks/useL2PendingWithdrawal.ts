import { useAccount, useReadContract } from 'wagmi'
import { linea } from 'wagmi/chains'

import { DEMO_MODE, MOCK_L1_BALANCES, useDemoVaultState } from '~/utils/demo'
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

  // DEMO_MODE — also called when not in demo mode (rules-of-hooks); ignored.
  const demo = useDemoVaultState(vault)

  const real = useReadContract({
    abi: L2ClaimVaultAbi,
    address: vault.l2ClaimVaultAddress,
    chainId: linea.id,
    functionName: 'pendingWithdrawal',
    args: address ? [address] : undefined,
    query: {
      enabled: !DEMO_MODE && !!address && !!vault.l2ClaimVaultAddress,
      refetchInterval: poll ? 30_000 : false,
    },
  })

  if (DEMO_MODE) {
    let mock: bigint = 0n
    if (demo.phase === 'claimable') {
      // Prefer the actual amount the user "unlocked"; fall back to a mock if
      // demo state was created before unlockedAmount was tracked.
      mock = demo.unlockedAmount ?? MOCK_L1_BALANCES[vault.id] ?? 0n
    }
    return { ...real, data: mock }
  }

  return real
}
