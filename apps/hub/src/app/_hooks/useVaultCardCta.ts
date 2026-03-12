import { useMemo } from 'react'

import { VAULT_STATE } from './usePreDepositVaultState'

import type { BridgeMessageStatus } from './useLineaBridgeMessageStatus'

export type VaultCardAction =
  | 'deposit'
  | 'unlock'
  | 'claim'
  | 'bridging'
  | 'none'

type VaultCardLabelKey =
  | 'vault.deposit'
  | 'vault.unlock_label'
  | 'vault.allocate_funds'
  | 'vault.bridging'
  | 'vault.coming_soon'

type VaultCardCtaParams = {
  vaultState: number | undefined
  l1Balance: bigint | undefined
  l2PendingAmount: bigint | undefined
  bridgeStatus?: BridgeMessageStatus
  hasUnlockTxHash?: boolean
}

export type VaultCardCta = {
  action: VaultCardAction
  labelKey: VaultCardLabelKey
  isDisabled: boolean
  isClaimReady: boolean
  displayBalance: bigint
}

export const getVaultCardCta = ({
  vaultState,
  l1Balance,
  l2PendingAmount,
  bridgeStatus,
  hasUnlockTxHash,
}: VaultCardCtaParams): VaultCardCta => {
  const safeL1Balance = l1Balance ?? 0n
  const safeL2PendingAmount = l2PendingAmount ?? 0n

  const hasL1Balance = safeL1Balance > 0n
  const hasL2Pending = safeL2PendingAmount > 0n
  // If L2 pending exists in WITHDRAWALS, the user has already unlocked (L1 balance
  // is 0 on-chain). Cached L1 balance may be stale, so don't gate on !hasL1Balance.
  const isClaimReady = vaultState === VAULT_STATE.WITHDRAWALS && hasL2Pending

  if (isClaimReady) {
    return {
      action: 'claim',
      labelKey: 'vault.allocate_funds',
      isDisabled: false,
      isClaimReady: true,
      displayBalance: safeL2PendingAmount,
    }
  }

  // After unlock: bridge in progress.
  // When we have a stored unlock tx hash, trust it over cached L1 balance
  // (the balance is 0 on-chain but the cache may be stale).
  if (
    vaultState === VAULT_STATE.WITHDRAWALS &&
    !hasL2Pending &&
    (hasUnlockTxHash || (!hasL1Balance && bridgeStatus === 'pending'))
  ) {
    return {
      action: 'bridging',
      labelKey: 'vault.bridging',
      isDisabled: true,
      isClaimReady: false,
      displayBalance: 0n,
    }
  }

  if (vaultState === VAULT_STATE.WITHDRAWALS) {
    return {
      action: hasL1Balance ? 'unlock' : 'none',
      labelKey: 'vault.unlock_label',
      isDisabled: !hasL1Balance,
      isClaimReady: false,
      displayBalance: safeL1Balance,
    }
  }

  if (vaultState === VAULT_STATE.DEPOSITS) {
    return {
      action: 'deposit',
      labelKey: 'vault.deposit',
      isDisabled: false,
      isClaimReady: false,
      displayBalance: safeL1Balance,
    }
  }

  return {
    action: 'none',
    labelKey: 'vault.coming_soon',
    isDisabled: true,
    isClaimReady: false,
    displayBalance: safeL1Balance,
  }
}

export const useVaultCardCta = ({
  vaultState,
  l1Balance,
  l2PendingAmount,
  bridgeStatus,
  hasUnlockTxHash,
}: VaultCardCtaParams): VaultCardCta =>
  useMemo(
    () =>
      getVaultCardCta({
        vaultState,
        l1Balance,
        l2PendingAmount,
        bridgeStatus,
        hasUnlockTxHash,
      }),
    [vaultState, l1Balance, l2PendingAmount, bridgeStatus, hasUnlockTxHash]
  )
