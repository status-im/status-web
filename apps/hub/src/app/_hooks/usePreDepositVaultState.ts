import { useReadContract } from 'wagmi'

import { GUSD_STABLECOINS, isGUSDVault, type Vault } from '~constants/address'
import { PreDepositVaultAbi } from '~constants/contracts/PreDepositVaultAbi'

import type { Address } from 'viem'

export const VAULT_STATE = {
  INITIAL: 0,
  DEPOSITS: 1,
  STRATEGY_WITHDRAWAL: 2,
  BRIDGING: 3,
  WITHDRAWALS: 4,
} as const

export type VaultState = (typeof VAULT_STATE)[keyof typeof VAULT_STATE]

export function usePreDepositVaultState(vault: Vault) {
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
