import { DropdownMenu, IconButton } from '@status-im/components'
import { AlertIcon, TimeIcon } from '@status-im/icons/12'
import { LockedIcon, OptionsIcon, UnlockedIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { createColumnHelper } from '@tanstack/react-table'
import { formatUnits } from 'viem'

import { SNT_TOKEN } from '~constants/index'
import { type StakingVault } from '~hooks/useStakingVaults'
import { shortenAddress } from '~utils/address'
import { formatSNT } from '~utils/currency'
import { calculateDaysUntilUnlock, isVaultLocked } from '~utils/vault'

import { LockVaultModal } from './modals/lock-vault-modal'
import { UnstakeVaultModal } from './modals/unstake-vault'
import { WithdrawVaultModal } from './modals/withdraw-vault-modal'

import type { Address } from 'viem'

interface TableColumnsProps {
  vaults: StakingVault[] | undefined
  openModalVaultId: string | null
  emergencyModeEnabled: unknown
  chainId: number
  isConnected: boolean
  openDropdownId: string | null
  setOpenDropdownId: (id: string | null) => void
  setOpenModalVaultId: (vaultId: string | null) => void
}

// Calculate total staked across all vaults
const calculateTotalStaked = (vaults: StakingVault[]): bigint => {
  return vaults.reduce(
    (acc, vault) => acc + (vault.data?.stakedBalance || 0n),
    BigInt(0)
  )
}

// Calculate total karma across all vaults
const calculateTotalKarma = (vaults: StakingVault[]): bigint => {
  return vaults.reduce(
    (acc, vault) => acc + (vault.data?.rewardsAccrued || 0n),
    BigInt(0)
  )
}

// Cache current time to avoid calling Date.now() on every cell render
const getCurrentTimestamp = (): bigint => {
  return BigInt(Math.floor(Date.now() / 1000))
}

// Validation function for lock time - extracted to avoid recreating on every render
const validateLockTime = (_: string, days: string): string | null => {
  const totalDays = parseInt(days || '0')
  // TODO: read this from the contract
  return totalDays > 1460 ? 'Maximum lock time is 4 years' : null
}

const resolveChainExplorerHref = (
  chainId: number,
  address: Address
): string => {
  switch (chainId) {
    case 1660990954:
      return `https://sepoliascan.status.network/address/${address}`
    default:
      return `https://etherscan.io/address/${address}`
  }
}

// Modal action configurations - static, never change
const EXTEND_LOCK_ACTIONS = [
  { label: 'Cancel' },
  { label: 'Extend lock' },
] as const

const LOCK_VAULT_ACTIONS = [{ label: "Don't lock" }, { label: 'Lock' }] as const

const LOCK_INFO_MESSAGE =
  'Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks.' as const

export const createVaultTableColumns = ({
  vaults = [],
  openModalVaultId,
  setOpenModalVaultId,
  emergencyModeEnabled,
  isConnected,
  openDropdownId,
  setOpenDropdownId,
  chainId,
}: TableColumnsProps) => {
  // Calculate totals and current time once per column creation
  const totalStaked = calculateTotalStaked(vaults)
  const totalKarma = calculateTotalKarma(vaults)
  const currentTimestamp = getCurrentTimestamp()
  const columnHelper = createColumnHelper<StakingVault>()

  return [
    columnHelper.accessor('address', {
      id: 'vault',
      header: 'Vault',
      cell: ({ row }) => {
        return (
          <span className="whitespace-pre text-13 font-medium text-neutral-100">
            #{Number(row.index) + 1}
          </span>
        )
      },
      footer: () => {
        return (
          <span className="text-13 font-medium text-neutral-50">Total</span>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('address', {
      header: 'Address',
      cell: ({ row }) => {
        return (
          <span className="whitespace-pre text-13 font-medium text-neutral-100">
            {shortenAddress(row.original.address)}
          </span>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('data.stakedBalance', {
      header: 'Staked',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <span className="text-13 font-medium text-neutral-100">
              {formatSNT(row.original.data?.stakedBalance || 0n)}
              <span className="ml-0.5 text-neutral-50">SNT</span>
            </span>
          </div>
        )
      },
      footer: () => {
        return (
          <span className="text-13 font-medium text-neutral-100">
            {formatSNT(totalStaked)}
            <span className="ml-0.5 text-neutral-50">SNT</span>
          </span>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('data.lockUntil', {
      header: 'Unlocks in',
      cell: ({ row }) => {
        const isLocked = isVaultLocked(row.original.data?.lockUntil)
        const daysUntilUnlock = isLocked
          ? calculateDaysUntilUnlock(row.original.data?.lockUntil)
          : null

        if (!daysUntilUnlock) {
          return null
        }

        return (
          <div className="flex items-center gap-0.5">
            <span className="text-13 font-medium text-neutral-100">
              {daysUntilUnlock}
              <span className="ml-0.5 text-neutral-50">d</span>
            </span>
          </div>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('data.maxMP', {
      header: 'Boost',
      cell: ({ row }) => {
        const stakedBalance = row.original.data?.stakedBalance || 0n
        const maxMP = row.original.data?.maxMP || 0n
        const mpAccrued = row.original.data?.mpAccrued || 0n

        const potentialBoost =
          stakedBalance > 0n && maxMP > mpAccrued
            ? (maxMP - mpAccrued) / stakedBalance
            : undefined

        // Calculate boost directly instead of recalculating for all vaults
        // Boost = (mpAccrued / stakedBalance) + 1 (base multiplier)
        const currentBoost =
          stakedBalance > 0n
            ? Number(formatUnits(mpAccrued, SNT_TOKEN.decimals)) /
                Number(formatUnits(stakedBalance, SNT_TOKEN.decimals)) +
              1
            : 1

        return (
          <div className="flex items-center gap-3">
            <span className="text-13 font-medium text-neutral-100">
              x{currentBoost.toFixed(2)}
            </span>
            {potentialBoost && (
              <span className="text-13 font-medium text-purple">
                x{formatSNT(formatUnits(potentialBoost, SNT_TOKEN.decimals))} if
                locked
              </span>
            )}
          </div>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('data.rewardsAccrued', {
      header: 'Karma',
      cell: ({ row }) => {
        const karma = Number(row.original.data?.rewardsAccrued) / 1e18
        return (
          <div className="flex items-center gap-1">
            <span className="text-13 font-medium text-neutral-100">
              {formatSNT(karma)}
              <span className="ml-0.5 text-neutral-50">KARMA</span>
            </span>
          </div>
        )
      },
      footer: () => {
        return (
          <span className="text-13 font-medium text-neutral-100">
            {formatSNT(totalKarma)}
            <span className="ml-0.5 text-neutral-50">KARMA</span>
          </span>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('data.lockUntil', {
      id: 'state',
      header: 'State',
      cell: ({ row }) => {
        const isLocked = isVaultLocked(row.original.data?.lockUntil)

        return (
          <div className="flex items-center gap-1">
            {isLocked ? (
              <LockedIcon />
            ) : (
              <UnlockedIcon className="text-purple" />
            )}
            <span className="text-13 font-medium capitalize text-neutral-100">
              {isLocked ? 'Locked' : 'Open'}
            </span>
          </div>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const withdrawModalId = `withdraw-${row.original.address}`
        const lockModalId = `lock-${row.original.address}`
        const unstakeModalId = `unstake-${row.original.address}`
        const dropdownId = `dropdown-${row.original.address}`
        const isWithdrawModalOpen = openModalVaultId === withdrawModalId
        const isLockModalOpen = openModalVaultId === lockModalId
        const isUnstakeModalOpen = openModalVaultId === unstakeModalId
        const isDropdownOpen = openDropdownId === dropdownId

        // Use cached timestamp instead of calling Date.now() on every render
        const isLocked = row.original?.data?.lockUntil
          ? row.original.data.lockUntil > currentTimestamp
          : false

        return (
          <div className="flex items-end justify-end gap-2">
            {isLocked ? (
              <div className="flex items-center gap-2">
                {!emergencyModeEnabled && (
                  <WithdrawVaultModal
                    open={isWithdrawModalOpen}
                    onOpenChange={open =>
                      setOpenModalVaultId(open ? withdrawModalId : null)
                    }
                    onClose={() => setOpenModalVaultId(null)}
                    vaultAddress={row.original.address}
                  >
                    <Button
                      variant="danger"
                      size="32"
                      disabled={!isConnected}
                      className="min-w-fit bg-danger-50 text-13 text-white-100 hover:bg-danger-60"
                    >
                      <AlertIcon className="shrink-0" />
                      <span className="hidden whitespace-nowrap xl:inline">
                        Withdraw funds
                      </span>
                      <span className="whitespace-nowrap xl:hidden">
                        Withdraw
                      </span>
                    </Button>
                  </WithdrawVaultModal>
                )}
                <LockVaultModal
                  open={isLockModalOpen}
                  onOpenChange={open =>
                    setOpenModalVaultId(open ? lockModalId : null)
                  }
                  vaultAddress={row.original.address}
                  title="Extend lock time"
                  initialYears="2"
                  initialDays="732"
                  description="Extending lock time increasing Karma boost"
                  actions={[...EXTEND_LOCK_ACTIONS]}
                  onClose={() => setOpenModalVaultId(null)}
                  infoMessage={LOCK_INFO_MESSAGE}
                >
                  <Button
                    variant="primary"
                    size="32"
                    disabled={!isConnected}
                    className="min-w-fit text-13"
                  >
                    <TimeIcon className="shrink-0" />
                    <span className="hidden whitespace-nowrap xl:inline">
                      Extend lock time
                    </span>
                    <span className="whitespace-nowrap xl:hidden">Extend</span>
                  </Button>
                </LockVaultModal>
              </div>
            ) : (
              <LockVaultModal
                open={isLockModalOpen}
                onOpenChange={open =>
                  setOpenModalVaultId(open ? lockModalId : null)
                }
                vaultAddress={row.original.address}
                title="Do you want to lock the vault?"
                description="Lock this vault to receive more Karma"
                actions={[...LOCK_VAULT_ACTIONS]}
                onClose={() => setOpenModalVaultId(null)}
                infoMessage={LOCK_INFO_MESSAGE}
                onValidate={validateLockTime}
              >
                <Button
                  variant="primary"
                  size="32"
                  disabled={!isConnected}
                  className="min-w-fit text-13"
                >
                  <LockedIcon fill="white" className="shrink-0" />
                  <span className="whitespace-nowrap">Lock</span>
                </Button>
              </LockVaultModal>
            )}
            <DropdownMenu.Root
              onOpenChange={open => setOpenDropdownId(open ? dropdownId : null)}
              open={isDropdownOpen}
            >
              <IconButton icon={<OptionsIcon />} variant="outline" />
              <DropdownMenu.Content
                collisionPadding={12}
                sideOffset={10}
                className="w-[256px]"
                style={{ zIndex: 100 }}
              >
                {!isLocked && (
                  <DropdownMenu.Item
                    label="Unstake"
                    onSelect={() => {
                      setOpenModalVaultId(unstakeModalId)
                    }}
                  />
                )}
                <DropdownMenu.Item
                  label="Open in blockchain explorer"
                  external
                  onSelect={() => {
                    window.open(
                      resolveChainExplorerHref(chainId, row.original.address),
                      '_blank'
                    )
                  }}
                />
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <UnstakeVaultModal
              open={isUnstakeModalOpen}
              onOpenChange={open =>
                setOpenModalVaultId(open ? unstakeModalId : null)
              }
              onClose={() => setOpenModalVaultId(null)}
              vaultAddress={row.original.address}
            />
          </div>
        )
      },
      meta: {
        headerClassName: 'text-right',
        cellClassName: 'text-right',
      },
    }),
  ]
}
