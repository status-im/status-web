'use client'

import { useState } from 'react'

import { DropdownMenu } from '@status-im/components'
import {
  AddSmallIcon,
  DropdownIcon,
  LockedIcon,
  UnlockedIcon,
} from '@status-im/icons/20'

import { formatSNT } from '~utils/currency'
import { isVaultLocked } from '~utils/vault'

import type { StakingVault } from '~hooks/useStakingVaults'

// ============================================================================
// Types
// ============================================================================

interface VaultSelectProps {
  /**
   * List of available vaults to select from
   */
  vaults: StakingVault[]
  /**
   * Currently selected vault address
   */
  value: string
  /**
   * Callback when vault selection changes
   */
  onChange: (vaultAddress: string) => void
  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean
  /**
   * Placeholder text when no vault is selected
   * @default "Add new vault"
   */
  placeholder?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Gets display label for a vault option
 */
function getVaultLabel(vault: StakingVault, index: number): string {
  const stakedAmount = vault.data?.stakedBalance
    ? formatSNT(vault.data.stakedBalance)
    : '0'

  // Format: #1 - 0xd233...34c4, 100,000,000 SNT
  const shortAddress = `${vault.address.slice(0, 6)}...${vault.address.slice(-4)}`
  return `#${index + 1} - ${shortAddress}, ${stakedAmount} SNT`
}

// ============================================================================
// Component
// ============================================================================

/**
 * Vault selection dropdown component
 *
 * Displays a list of user vaults with their staked balances.
 * Allows selecting a vault or creating a new one.
 *
 * @example
 * ```tsx
 * function StakeForm() {
 *   const { data: vaults } = useAccountVaults()
 *   const [selectedVault, setSelectedVault] = useState('')
 *
 *   return (
 *     <VaultSelect
 *       vaults={vaults ?? []}
 *       value={selectedVault}
 *       onChange={setSelectedVault}
 *     />
 *   )
 * }
 * ```
 */
export function VaultSelect({
  vaults,
  value,
  onChange,
  disabled = false,
  placeholder = 'Add new vault',
}: VaultSelectProps) {
  const [open, setOpen] = useState(false)

  // Find the selected vault to display its label
  const selectedVault = vaults.find(vault => vault.address === value)
  const selectedIndex = vaults.findIndex(vault => vault.address === value)

  const isLocked = isVaultLocked(selectedVault?.data?.lockUntil)

  const displayLabel =
    selectedVault && selectedIndex !== -1
      ? getVaultLabel(selectedVault, selectedIndex)
      : placeholder

  // If no vaults exist, show the "New vault" option (disabled)
  const hasVaults = vaults.length > 0

  const trigger = (
    <button
      type="button"
      disabled={disabled}
      className="flex w-full items-center justify-between rounded-12 border border-neutral-20 bg-white-100 px-3 py-[9px] text-left text-15 text-neutral-100 transition data-[state=open]:border-neutral-30 hover:border-neutral-30"
    >
      <div className="flex min-w-0 items-center gap-2">
        {selectedVault ? (
          isLocked ? (
            <LockedIcon className="size-5 shrink-0 text-purple" />
          ) : (
            <UnlockedIcon className="size-5 shrink-0 text-purple" />
          )
        ) : (
          <AddSmallIcon className="size-5 shrink-0 text-neutral-100" />
        )}
        <span className="truncate font-regular leading-[2.15] tracking-[-0.135px]">
          {displayLabel}
        </span>
      </div>
      <DropdownIcon
        className={`shrink-0 text-neutral-40 transition-transform ${open ? 'rotate-180' : ''}`}
      />
    </button>
  )

  const content = (
    <DropdownMenu.Content
      align="start"
      className="z-50 max-h-[400px] w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto"
    >
      <DropdownMenu.Item
        icon={<AddSmallIcon className="text-neutral-100" />}
        label={placeholder}
        selected={!value}
        onSelect={() => {
          onChange('')
          setOpen(false)
        }}
      />
      {hasVaults ? (
        <>
          {vaults.map((vault, index) => {
            const isLocked = isVaultLocked(vault.data?.lockUntil)

            return (
              <DropdownMenu.Item
                key={vault.address}
                icon={
                  isLocked ? (
                    <LockedIcon className="text-purple" />
                  ) : (
                    <UnlockedIcon className="text-purple" />
                  )
                }
                label={getVaultLabel(vault, index)}
                selected={vault.address === value}
                onSelect={() => {
                  onChange(vault.address)
                  setOpen(false)
                }}
              />
            )
          })}
        </>
      ) : null}
    </DropdownMenu.Content>
  )

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      {trigger}
      {content}
    </DropdownMenu.Root>
  )
}
