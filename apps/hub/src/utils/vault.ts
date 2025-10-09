import { type Address, formatUnits } from 'viem'

import { SNT_TOKEN } from '~constants/index'

import type { StakingVault } from '~hooks/useStakingVaults'

/**
 * Calculates the boost multiplier for a vault
 *
 * @param vaults - The list of vaults
 * @param vaultAddress - The address of the vault
 * @returns The boost multiplier for the vault
 */
export function calculateVaultBoost(
  vaults: StakingVault[],
  vaultAddress: Address
): string {
  const account = vaults.find(vault => vault.address === vaultAddress)
  if (!account || account.data?.stakedBalance === 0n) return '1.00'
  const vaultStaked = Number(
    formatUnits(account.data?.stakedBalance || 0n, SNT_TOKEN.decimals)
  )
  const vaultMp = Number(
    formatUnits(account.data?.mpAccrued || 0n, SNT_TOKEN.decimals)
  )
  // Add 1 to reflect the boost (base multiplier is 1x)
  const boost = vaultMp / vaultStaked + 1
  return boost.toFixed(2)
}

/**
 * Checks if a vault is locked based on the lockUntil timestamp
 *
 * @param lockUntil - The lockUntil timestamp in seconds
 * @returns True if the vault is locked, false otherwise
 */
export function isVaultLocked(lockUntil: bigint | undefined) {
  if (!lockUntil) return false
  const now = Math.floor(Date.now() / 1000)
  const lockUntilTimestamp = Number(lockUntil)
  return lockUntilTimestamp > now
}

/**
 * Calculates the number of days until a vault unlocks
 *
 * @param lockUntil - The lockUntil timestamp in seconds
 * @returns The number of days until the vault unlocks, or null if the vault is not locked
 */
export function calculateDaysUntilUnlock(lockUntil: bigint | undefined) {
  if (!lockUntil) return null
  const now = Math.floor(Date.now() / 1000)
  const lockUntilTimestamp = Number(lockUntil)
  return Math.ceil((lockUntilTimestamp - now) / 86400)
}
