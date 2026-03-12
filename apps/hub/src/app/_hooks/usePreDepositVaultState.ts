import { useReadContract } from 'wagmi'

import { GUSD_STABLECOINS, isGUSDVault, type Vault } from '~constants/address'
import { PreDepositVaultAbi } from '~constants/contracts/PreDepositVaultAbi'

import type { Address } from 'viem'

// ============================================================================
// Constants
// ============================================================================

export const VAULT_STATE = {
  INITIAL: 0,
  DEPOSITS: 1,
  STRATEGY_WITHDRAWAL: 2,
  BRIDGING: 3,
  WITHDRAWALS: 4,
} as const

export type VaultState = (typeof VAULT_STATE)[keyof typeof VAULT_STATE]

// ============================================================================
// Hook
// ============================================================================

/**
 * Reads the current lifecycle state of a pre-deposit vault.
 *
 * For GUSD vaults, reads from the first underlying stablecoin vault
 * since `vault.address` is the GenericDepositor, not a PreDepositVault.
 */
export function usePreDepositVaultState(vault: Vault) {
  // For GUSD, read from the underlying stablecoin vault address
  const vaultAddress: Address = isGUSDVault(vault)
    ? GUSD_STABLECOINS[0].vaultAddress
    : vault.address

  return useReadContract({
    abi: PreDepositVaultAbi,
    address: vaultAddress,
    chainId: vault.chainId,
    functionName: 'getCurrentState',
  })
}
