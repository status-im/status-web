import { useMemo } from 'react'

import { match, P } from 'ts-pattern'

import { VAULT_STATE, type VaultState } from './usePreDepositVaultState'

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
  vaultState: VaultState | undefined
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

  return match(vaultState)
    .with(VAULT_STATE.WITHDRAWALS, (): VaultCardCta => {
      // If L2 pending exists, the user has already unlocked (L1 balance
      // is 0 on-chain). Cached L1 balance may be stale, so don't gate on !hasL1Balance.
      if (hasL2Pending) {
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
      if (hasUnlockTxHash || (!hasL1Balance && bridgeStatus === 'pending')) {
        return {
          action: 'bridging',
          labelKey: 'vault.bridging',
          isDisabled: true,
          isClaimReady: false,
          displayBalance: 0n,
        }
      }

      return {
        action: hasL1Balance ? 'unlock' : 'none',
        labelKey: 'vault.unlock_label',
        isDisabled: !hasL1Balance,
        isClaimReady: false,
        displayBalance: safeL1Balance,
      }
    })
    .with(VAULT_STATE.BRIDGING, () => ({
      action: 'bridging' as const,
      labelKey: 'vault.bridging' as const,
      isDisabled: true,
      isClaimReady: false,
      displayBalance: safeL1Balance,
    }))
    .with(VAULT_STATE.DEPOSITS, () => ({
      action: 'deposit' as const,
      labelKey: 'vault.deposit' as const,
      isDisabled: false,
      isClaimReady: false,
      displayBalance: safeL1Balance,
    }))
    .with(
      VAULT_STATE.INITIAL,
      VAULT_STATE.STRATEGY_WITHDRAWAL,
      P.nullish,
      () => ({
        action: 'none' as const,
        labelKey: 'vault.coming_soon' as const,
        isDisabled: true,
        isClaimReady: false,
        displayBalance: safeL1Balance,
      })
    )
    .exhaustive()
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
