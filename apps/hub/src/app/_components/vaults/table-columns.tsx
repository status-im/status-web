import { AlertIcon, TimeIcon } from '@status-im/icons/12'
import { LockedIcon, UnlockedIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { createColumnHelper } from '@tanstack/react-table'
import { formatUnits } from 'viem'

import { SNT_TOKEN } from '~constants/index'
import { type StakingVault } from '~hooks/useStakingVaults'
import { shortenAddress } from '~utils/address'
import { formatSNT } from '~utils/currency'
import {
  calculateDaysUntilUnlock,
  calculateVaultBoost,
  isVaultLocked,
} from '~utils/vault'

import { LockVaultModal } from './modals/lock-vault-modal'
import { WithdrawVaultModal } from './modals/withdraw-vault-modal'

interface TableColumnsProps {
  vaults: StakingVault[] | undefined
  openModalVaultId: string | null
  setOpenModalVaultId: (vaultId: string | null) => void
  emergencyModeEnabled: unknown
  isConnected: boolean
}

export const createVaultTableColumns = ({
  vaults = [],
  openModalVaultId,
  setOpenModalVaultId,
  emergencyModeEnabled,
  isConnected,
}: TableColumnsProps) => {
  const totalStaked = vaults.reduce(
    (acc, vault) => acc + (vault.data?.stakedBalance || 0n),
    BigInt(0)
  )
  const totalKarma = vaults.reduce(
    (acc, vault) => acc + (vault.data?.rewardsAccrued || 0n),
    BigInt(0)
  )
  const columnHelper = createColumnHelper<StakingVault>()

  return [
    columnHelper.accessor('address', {
      id: 'vault',
      header: 'Vault',
      cell: ({ row }) => {
        return (
          <span className="whitespace-pre text-[13px] font-medium text-neutral-100">
            #{Number(row.index) + 1}
          </span>
        )
      },
      footer: () => {
        return (
          <span className="text-[13px] font-medium text-neutral-50">Total</span>
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
          <span className="whitespace-pre text-[13px] font-medium text-neutral-100">
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
            <span className="text-[13px] font-medium text-neutral-100">
              {formatSNT(row.original.data?.stakedBalance || 0n)}
              <span className="ml-0.5 text-neutral-50">SNT</span>
            </span>
          </div>
        )
      },
      footer: () => {
        return (
          <span className="text-[13px] font-medium text-neutral-100">
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
            <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-100">
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

        return (
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-100">
              x{calculateVaultBoost(vaults, row.original.address)}
            </span>
            {potentialBoost && (
              <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-[#7140fd]">
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
            <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-100">
              {formatSNT(karma)}
              <span className="ml-0.5 text-neutral-50">KARMA</span>
            </span>
          </div>
        )
      },
      footer: () => {
        return (
          <span className="text-[13px] font-medium text-neutral-100">
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
            <span className="text-[13px] font-medium capitalize leading-[1.4] tracking-[-0.039px] text-neutral-100">
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
        const isWithdrawModalOpen = openModalVaultId === withdrawModalId
        const isLockModalOpen = openModalVaultId === lockModalId

        const isLocked = row.original?.data?.lockUntil
          ? row.original.data.lockUntil > BigInt(Math.floor(Date.now() / 1000))
          : false

        return (
          <div className="flex items-end justify-end gap-2 lg:gap-4">
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
                      className="min-w-fit bg-danger-50 text-[13px] text-white-100 hover:bg-danger-60"
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
                  actions={[
                    {
                      label: 'Cancel',
                    },
                    {
                      label: 'Extend lock',
                    },
                  ]}
                  onClose={() => setOpenModalVaultId(null)}
                  infoMessage="Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks."
                >
                  <Button
                    variant="primary"
                    size="32"
                    disabled={!isConnected}
                    className="min-w-fit text-[13px]"
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
                actions={[
                  {
                    label: "Don't lock",
                  },
                  {
                    label: 'Lock',
                  },
                ]}
                onClose={() => setOpenModalVaultId(null)}
                infoMessage="Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks."
                onValidate={(_, days) => {
                  const totalDays = parseInt(days || '0')
                  // TODO: read this from the contract
                  return totalDays > 1460
                    ? 'Maximum lock time is 4 years'
                    : null
                }}
              >
                <Button
                  variant="primary"
                  size="32"
                  disabled={!isConnected}
                  className="min-w-fit text-[13px]"
                >
                  <LockedIcon fill="white" className="shrink-0" />
                  <span className="whitespace-nowrap">Lock</span>
                </Button>
              </LockVaultModal>
            )}
          </div>
        )
      },
      meta: {
        headerClassName: 'text-center',
        cellClassName: 'text-right',
      },
    }),
  ]
}
