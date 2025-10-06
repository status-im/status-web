/* eslint-disable import/no-unresolved */

import { AlertIcon, OptionsIcon, TimeIcon } from '@status-im/icons/12'
import { LockedIcon, UnlockedIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { createColumnHelper } from '@tanstack/react-table'

import { formatKarma, formatSNT } from '../../../utils/currency'
import { calculateVaultBoost } from '../../../utils/vault'
import { type VaultWithAddress } from '../../_hooks/useAccountVaults'
import { VaultLockConfigModal } from './vault-lock-modal'
import { VaultWithdrawModal } from './withdraw-modal'

interface TableColumnsProps {
  vaults: VaultWithAddress[] | undefined
  openModalVaultId: string | null
  setOpenModalVaultId: (vaultId: string | null) => void
}

export const createVaultTableColumns = ({
  vaults = [],
  openModalVaultId,
  setOpenModalVaultId,
}: TableColumnsProps) => {
  const totalStaked = vaults.reduce(
    (acc, vault) => acc + (vault.data?.stakedBalance || 0n),
    BigInt(0)
  )
  const totalKarma = vaults.reduce(
    (acc, vault) => acc + (vault.data?.rewardsAccrued || 0n),
    BigInt(0)
  )
  const columnHelper = createColumnHelper<VaultWithAddress>()

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
            {row.original.address.slice(0, 6)}...
            {row.original.address.slice(-4)}
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
        const now = Math.floor(Date.now() / 1000)
        const lockUntilTimestamp = Number(row.original.data?.lockUntil)
        const isLocked = lockUntilTimestamp > now
        const daysUntilUnlock = isLocked
          ? Math.ceil((lockUntilTimestamp - now) / 86400)
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
            ? Number(maxMP - mpAccrued) / Number(stakedBalance)
            : undefined

        return (
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-100">
              x{calculateVaultBoost(vaults, row.original.address)}
            </span>
            {potentialBoost && (
              <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-[#7140fd]">
                x{potentialBoost.toFixed(2)} if locked
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
              {formatKarma(karma)}
              <span className="ml-0.5 text-neutral-50">KARMA</span>
            </span>
          </div>
        )
      },
      footer: () => {
        return (
          <span className="text-[13px] font-medium text-neutral-100">
            {formatKarma(totalKarma)}
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
        const now = Math.floor(Date.now() / 1000)
        const lockUntilTimestamp = Number(row.original.data?.lockUntil)
        const isLocked = lockUntilTimestamp > now

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
          ? row.original.data.lockUntil > 0
          : false

        return (
          <div className="flex items-center justify-end gap-2 lg:gap-4">
            {isLocked ? (
              <div className="flex items-center gap-2">
                <VaultWithdrawModal
                  open={isWithdrawModalOpen}
                  onOpenChange={open =>
                    setOpenModalVaultId(open ? withdrawModalId : null)
                  }
                  onClose={() => setOpenModalVaultId(null)}
                  vaultAdress={row.original.address}
                >
                  {/* @ts-expect-error - Button component is not typed */}
                  <Button
                    variant="destructive"
                    size="32"
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
                </VaultWithdrawModal>
                <VaultLockConfigModal
                  open={isLockModalOpen}
                  onOpenChange={open =>
                    setOpenModalVaultId(open ? lockModalId : null)
                  }
                  vaultAddress={row.original.address}
                  title="Extend lock time"
                  description="Extending lock time increasing Karma boost"
                  actions={[
                    {
                      label: 'Cancel',
                      onClick: () => setOpenModalVaultId(null),
                    },
                    {
                      label: 'Extend lock',
                      onClick: () => {
                        // Handle extend lock logic
                        setOpenModalVaultId(null)
                      },
                    },
                  ]}
                  onClose={() => setOpenModalVaultId(null)}
                  boost="x2.5"
                  infoMessage="Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks."
                >
                  {/* @ts-expect-error - Button component is not typed */}
                  <Button
                    variant="primary"
                    size="32"
                    className="min-w-fit text-[13px]"
                  >
                    <TimeIcon className="shrink-0" />
                    <span className="hidden whitespace-nowrap xl:inline">
                      Extend lock time
                    </span>
                    <span className="whitespace-nowrap xl:hidden">Extend</span>
                  </Button>
                </VaultLockConfigModal>
              </div>
            ) : (
              <VaultLockConfigModal
                open={isLockModalOpen}
                onOpenChange={open =>
                  setOpenModalVaultId(open ? lockModalId : null)
                }
                vaultAddress={row.original.address}
                title="Do you want to lock the vault?"
                description="Lock this vault to receive more Karma"
                sliderConfig={{
                  minLabel: '90 days',
                  maxLabel: '4 years',
                  minDays: 90,
                  maxDays: 1460,
                  initialPosition: 50,
                }}
                initialYears="2"
                initialDays="732"
                actions={[
                  {
                    label: "Don't lock",
                    onClick: () => setOpenModalVaultId(null),
                  },
                  {
                    label: 'Lock',
                    onClick: () => {
                      // Handle lock logic
                      setOpenModalVaultId(null)
                    },
                  },
                ]}
                onClose={() => setOpenModalVaultId(null)}
                boost="x2.5"
                infoMessage="Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks."
                onValidate={(_, days) => {
                  const totalDays = parseInt(days || '0')
                  return totalDays > 1460
                    ? 'Maximum lock time is 4 years'
                    : null
                }}
              >
                {/* @ts-expect-error - Button component is not typed */}
                <Button
                  variant="primary"
                  size="32"
                  className="min-w-fit text-[13px]"
                >
                  <LockedIcon fill="white" className="shrink-0" />
                  <span className="whitespace-nowrap">Lock</span>
                </Button>
              </VaultLockConfigModal>
            )}
            {/* @ts-expect-error - Button component is not typed */}
            <Button variant="outline" size="32" className="shrink-0">
              <OptionsIcon />
            </Button>
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
