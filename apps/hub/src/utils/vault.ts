import type { Vault } from '../app/_components/vaults/types'
import type {
  VaultData,
  VaultWithAddress,
} from '../app/_hooks/useAccountVaults'

/**
 * Transforms raw vault data from the contract into the UI-friendly Vault type
 */
export const transformVaultData = (
  vaultData: VaultData,
  vaultAddress: string,
  index: number
): Vault => {
  const now = Math.floor(Date.now() / 1000)
  const lockUntilTimestamp = Number(vaultData.lockUntil)
  const isLocked = lockUntilTimestamp > now
  const daysUntilUnlock = isLocked
    ? Math.ceil((lockUntilTimestamp - now) / 86400)
    : null

  // Calculate boost based on MP ratio
  const boost =
    vaultData.stakedBalance > 0n
      ? Number(vaultData.mpAccrued) / Number(vaultData.stakedBalance)
      : 0

  const potentialBoost =
    vaultData.stakedBalance > 0n && vaultData.maxMP > vaultData.mpAccrued
      ? Number(vaultData.maxMP - vaultData.mpAccrued) /
        Number(vaultData.stakedBalance)
      : undefined

  // Calculate karma based on rewards
  const karma = Number(vaultData.rewardsAccrued) / 1e18

  return {
    id: `${index}`,
    address: vaultAddress as `0x${string}`,
    staked: vaultData.stakedBalance,
    unlocksIn: daysUntilUnlock,
    boost,
    potentialBoost,
    karma,
    locked: isLocked,
  }
}

/**
 * Transforms vault data from contract format to UI format
 * Filters out vaults with failed data fetches
 */
export const transformVaults = (vaultDataList: VaultWithAddress[]): Vault[] => {
  return vaultDataList
    .map((vault, index) => {
      if (!vault.data) return null
      return transformVaultData(vault.data, vault.address, index)
    })
    .filter((vault): vault is Vault => vault !== null)
}
