import { isGUSDVault, type Vault } from '~constants/address'

import { useGUSDUserBalance } from './useGUSDUserBalance'
import { useL2PendingWithdrawal } from './useL2PendingWithdrawal'
import {
  usePreDepositVaultState,
  VAULT_STATE,
  type VaultState,
} from './usePreDepositVaultState'
import { useUserVaultDeposit } from './useUserVaultDeposit'

type Params = {
  vault: Vault
  registerRefetch?: (vaultId: string, refetch: () => void) => void
  pollL2?: boolean
}

export function useVaultBalanceReadiness({
  vault,
  registerRefetch,
  pollL2,
}: Params) {
  const isGUSD = isGUSDVault(vault)

  const { data: vaultState } = usePreDepositVaultState(vault)
  const {
    data: depositedBalance,
    isLoading: isDepositedBalanceLoading,
    refetch: refetchDepositedBalance,
  } = useUserVaultDeposit({
    vault,
    enabled: !isGUSD,
    registerRefetch: isGUSD ? undefined : registerRefetch,
  })
  const {
    data: gusdBalance,
    isLoading: isGUSDBalanceLoading,
    refetch: refetchGUSDBalance,
  } = useGUSDUserBalance({
    enabled: isGUSD,
    registerRefetch: isGUSD ? registerRefetch : undefined,
  })
  const {
    data: l2PendingAmount,
    isLoading: isL2PendingLoading,
    refetch: refetchL2PendingWithdrawal,
  } = useL2PendingWithdrawal({ vault, poll: pollL2 })

  const l1Balance = isGUSD ? gusdBalance : depositedBalance
  const isL1BalanceLoading = isGUSD
    ? isGUSDBalanceLoading
    : isDepositedBalanceLoading

  const hasL1Balance = (l1Balance ?? 0n) > 0n
  const hasL2Pending = (l2PendingAmount ?? 0n) > 0n
  const isClaimReady =
    vaultState === VAULT_STATE.WITHDRAWALS && !hasL1Balance && hasL2Pending

  const refetchL1Balance = isGUSD ? refetchGUSDBalance : refetchDepositedBalance

  const refetchBalances = async () => {
    await Promise.all([refetchL1Balance(), refetchL2PendingWithdrawal()])
  }

  return {
    isGUSD,
    vaultState: vaultState as VaultState | undefined,
    l1Balance,
    l2PendingAmount,
    isL1BalanceLoading,
    isL2PendingLoading,
    hasL1Balance,
    hasL2Pending,
    isClaimReady,
    refetchL1Balance,
    refetchL2PendingWithdrawal,
    refetchBalances,
  }
}
