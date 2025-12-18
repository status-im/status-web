import { DropdownMenu, IconButton } from '@status-im/components'
import { AlertIcon, TimeIcon } from '@status-im/icons/12'
import { LockedIcon, OptionsIcon, UnlockedIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { createColumnHelper } from '@tanstack/react-table'
import { formatUnits } from 'viem'

import { EXTEND_LOCK_PERIOD, STT_TOKEN } from '~constants/index'
import { type StakingVault } from '~hooks/useStakingVaults'
import { shortenAddress } from '~utils/address'
import { formatSNT, formatSTT } from '~utils/currency'
import { calculateDaysUntilUnlock, isVaultLocked } from '~utils/vault'

import { LockVaultModal } from './modals/lock-vault-modal'
import { UnstakeVaultModal } from './modals/unstake-vault'
import { WithdrawVaultModal } from './modals/withdraw-vault-modal'

import type { useTranslations } from 'next-intl'
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
  t: ReturnType<typeof useTranslations>
}

// Calculate total staked across all vaults
const calculateTotalStaked = (
  vaults: StakingVault[],
  emergencyMode: boolean
): bigint => {
  return vaults.reduce(
    (acc, vault) =>
      acc +
      (emergencyMode
        ? vault.data?.depositedBalance || 0n
        : vault.data?.stakedBalance || 0n),
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
const createValidateLockTime =
  (t: ReturnType<typeof useTranslations>) =>
  (_: string, days: string): string | null => {
    const totalDays = parseInt(days || '0')
    // TODO: read this from the contract
    return totalDays > 1460 ? t('stake.max_lock_time') : null
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

// Modal action configurations - created with translations
const createExtendLockActions = (t: ReturnType<typeof useTranslations>) =>
  [{ label: t('common.cancel') }, { label: t('stake.extend_lock') }] as const

const createLockVaultActions = (t: ReturnType<typeof useTranslations>) =>
  [{ label: t('stake.dont_lock') }, { label: t('stake.lock') }] as const

const createLockInfoMessage = (t: ReturnType<typeof useTranslations>) => {
  return t('stake.lock_info_message')
}

export const createVaultTableColumns = ({
  vaults = [],
  openModalVaultId,
  setOpenModalVaultId,
  emergencyModeEnabled,
  isConnected,
  openDropdownId,
  setOpenDropdownId,
  chainId,
  t,
}: TableColumnsProps) => {
  // Calculate totals and current time once per column creation
  const totalStaked = calculateTotalStaked(
    vaults,
    Boolean(emergencyModeEnabled)
  )
  const totalKarma = calculateTotalKarma(vaults)
  const currentTimestamp = getCurrentTimestamp()
  const columnHelper = createColumnHelper<StakingVault>()
  const validateLockTime = createValidateLockTime(t)
  const EXTEND_LOCK_ACTIONS = createExtendLockActions(t)
  const LOCK_VAULT_ACTIONS = createLockVaultActions(t)
  const LOCK_INFO_MESSAGE = createLockInfoMessage(t)

  return [
    columnHelper.accessor('address', {
      id: 'vault',
      header: t('stake.vault'),
      cell: ({ row }) => {
        return (
          <span className="whitespace-pre text-13 font-medium text-neutral-100">
            #{Number(row.index) + 1}
          </span>
        )
      },
      footer: () => {
        return (
          <span className="text-13 font-medium text-neutral-50">
            {t('stake.total')}
          </span>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('address', {
      header: t('stake.address'),
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
      header: emergencyModeEnabled
        ? t('stake.vault_balance')
        : t('stake.staked'),
      cell: ({ row }) => {
        const balance = emergencyModeEnabled
          ? row.original.data?.depositedBalance
          : row.original.data?.stakedBalance
        return (
          <div className="flex items-center gap-1">
            <span className="text-13 font-medium text-neutral-100">
              {formatSTT(balance || 0n, { includeSymbol: true })}
            </span>
          </div>
        )
      },
      footer: () => {
        return (
          <span className="text-13 font-medium text-neutral-100">
            {formatSTT(totalStaked, { includeSymbol: true })}
          </span>
        )
      },
      meta: {
        headerClassName: 'text-left',
        cellClassName: 'text-left',
      },
    }),
    columnHelper.accessor('data.lockUntil', {
      header: t('stake.unlocks_in'),
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
      header: t('stake.boost'),
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
            ? Number(formatUnits(mpAccrued, STT_TOKEN.decimals)) /
                Number(formatUnits(stakedBalance, STT_TOKEN.decimals)) +
              1
            : 1

        return (
          <div className="flex items-center gap-3">
            <span className="text-13 font-medium text-neutral-100">
              x{currentBoost.toFixed(2)}
            </span>
            {potentialBoost && (
              <span className="text-13 font-medium text-purple">
                x{formatSNT(formatUnits(potentialBoost, STT_TOKEN.decimals))}{' '}
                {t('stake.if_locked')}
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
      header: t('karma.title'),
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
      header: t('stake.state'),
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
              {isLocked ? t('stake.locked') : t('stake.open')}
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
      header: t('stake.actions'),
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
          <div className="flex items-end justify-end gap-2 lg:gap-4">
            {emergencyModeEnabled ? (
              <WithdrawVaultModal
                open={isWithdrawModalOpen}
                onOpenChange={open =>
                  setOpenModalVaultId(open ? withdrawModalId : null)
                }
                onClose={() => setOpenModalVaultId(null)}
                vaultAddress={row.original.address}
                amountWei={row.original.data?.depositedBalance || 0n}
              >
                <Button
                  variant="danger"
                  size="24"
                  iconBefore={<AlertIcon />}
                  disabled={
                    !row.original.data?.depositedBalance ||
                    row.original.data.depositedBalance === 0n
                  }
                >
                  Withdraw funds
                </Button>
              </WithdrawVaultModal>
            ) : (
              <>
                {isLocked ? (
                  <div className="flex items-center gap-2">
                    <LockVaultModal
                      open={isLockModalOpen}
                      onOpenChange={open =>
                        setOpenModalVaultId(open ? lockModalId : null)
                      }
                      vaultAddress={row.original.address}
                      title={t('stake.extend_lock_title')}
                      initialYears={EXTEND_LOCK_PERIOD.INITIAL_YEARS}
                      initialDays={EXTEND_LOCK_PERIOD.INITIAL_DAYS}
                      description={t('stake.extend_lock_description')}
                      actions={[...EXTEND_LOCK_ACTIONS]}
                      onClose={() => setOpenModalVaultId(null)}
                      infoMessage={LOCK_INFO_MESSAGE}
                    >
                      <Button
                        variant="primary"
                        size="24"
                        disabled={!isConnected}
                      >
                        <TimeIcon className="shrink-0" />
                        <span className="hidden whitespace-nowrap xl:inline">
                          {t('stake.extend_lock_time')}
                        </span>
                        <span className="whitespace-nowrap xl:hidden">
                          {t('stake.extend')}
                        </span>
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
                    title={t('stake.do_you_want_to_lock')}
                    description={t('stake.lock_description')}
                    actions={[...LOCK_VAULT_ACTIONS]}
                    onClose={() => setOpenModalVaultId(null)}
                    infoMessage={LOCK_INFO_MESSAGE}
                    onValidate={validateLockTime}
                  >
                    <Button variant="primary" size="24" disabled={!isConnected}>
                      <LockedIcon fill="white" className="shrink-0" />
                      <span className="whitespace-nowrap">
                        {t('stake.lock')}
                      </span>
                    </Button>
                  </LockVaultModal>
                )}
              </>
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
                    label={t('stake.unstake')}
                    onSelect={() => {
                      setOpenModalVaultId(unstakeModalId)
                    }}
                  />
                )}
                <DropdownMenu.Item
                  label={t('stake.open_in_explorer')}
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
