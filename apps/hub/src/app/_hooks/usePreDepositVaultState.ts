import { useReadContract } from 'wagmi'

import { DEMO_MODE } from '~/utils/demo'
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

  const real = useReadContract({
    abi: PreDepositVaultAbi,
    address: vaultAddress,
    chainId: vault.chainId,
    functionName: 'getCurrentState',
    query: { enabled: !DEMO_MODE },
  })

  // DEMO_MODE: pretend every vault is in WITHDRAWALS state so unlock CTAs enable.
  if (DEMO_MODE) {
    return { ...real, data: VAULT_STATE.WITHDRAWALS }
  }

  return real
}
