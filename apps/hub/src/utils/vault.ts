import { type Address, formatUnits } from 'viem'

import { SNT_TOKEN } from '../config'

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

export function calculateVaultBoost(
  vaults: VaultWithAddress[],
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
