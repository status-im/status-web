/* eslint-disable import/no-unresolved */

import { OptionsIcon, TimeIcon } from '@status-im/icons/12'
import { LockedIcon, UnlockedIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { createColumnHelper } from '@tanstack/react-table'

import { formatKarma, formatSNT } from '../../../utils/currency'
import { VaultLockConfigModal } from './lock-modal'

import type { Vault } from './types'

interface TableColumnsProps {
  data: Vault[]
  openModalVaultId: string | null
  setOpenModalVaultId: (vaultId: string | null) => void
}

export const createVaultTableColumns = ({
  data,
  openModalVaultId,
  setOpenModalVaultId,
}: TableColumnsProps) => {
  const totalStaked = data.reduce((acc, vault) => acc + vault.staked, BigInt(0))
  const totalKarma = data.reduce((acc, vault) => acc + vault.karma, 0)
  const columnHelper = createColumnHelper<Vault>()

  return [
    columnHelper.accessor('id', {
      id: 'vault',
      header: 'Vault',
      cell: ({ row }) => {
        return (
          <span className="whitespace-pre text-[13px] font-medium text-neutral-100">
            #{row.original.id}
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
    columnHelper.accessor('staked', {
      header: 'Staked',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-medium text-neutral-100">
              {formatSNT(row.original.staked)}
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
    columnHelper.accessor('unlocksIn', {
      header: 'Unlocks in',
      cell: ({ row }) => {
        if (row.original.unlocksIn === null) {
          return null
        }
        return (
          <div className="flex items-center gap-0.5">
            <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-100">
              {row.original.unlocksIn}
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
    columnHelper.accessor('boost', {
      header: 'Boost',
      cell: ({ row }) => {
        if (!row.original.boost) {
          return null
        }
        return (
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-100">
              x{row.original.boost.toFixed(2)}
            </span>
            {row.original.potentialBoost && (
              <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-[#7140fd]">
                x{row.original.potentialBoost.toFixed(2)} if locked
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
    columnHelper.accessor('karma', {
      header: 'Karma',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-100">
              {formatKarma(row.original.karma)}
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
    columnHelper.accessor('locked', {
      id: 'state',
      header: 'State',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {row.original.locked ? (
              <LockedIcon />
            ) : (
              <UnlockedIcon fill="currentColor" />
            )}
            <span className="text-[13px] font-medium capitalize leading-[1.4] tracking-[-0.039px] text-neutral-100">
              {row.original.locked ? 'Locked' : 'Open'}
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
        const isModalOpen = openModalVaultId === row.original.id

        return (
          <div className="flex items-center justify-end gap-4">
            {row.original.locked ? (
              <VaultLockConfigModal
                open={isModalOpen}
                onOpenChange={open =>
                  setOpenModalVaultId(open ? row.original.id : null)
                }
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
                unlockDate="30/01/2026"
                infoMessage="Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks."
              >
                {/* @ts-expect-error - Button component is not typed */}
                <Button variant="primary" size="32" className="text-[13px]">
                  <TimeIcon />
                  Extend lock time
                </Button>
              </VaultLockConfigModal>
            ) : (
              <VaultLockConfigModal
                open={isModalOpen}
                onOpenChange={open =>
                  setOpenModalVaultId(open ? row.original.id : null)
                }
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
                unlockDate="30/01/2025"
                infoMessage="Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks."
                onValidate={(years, days) => {
                  const totalDays =
                    parseInt(years || '0') * 365 + parseInt(days || '0')
                  return totalDays > 1460
                    ? 'Maximum lock time is 4 years'
                    : null
                }}
              >
                {/* @ts-expect-error - Button component is not typed */}
                <Button variant="primary" size="32" className="text-[13px]">
                  <LockedIcon fill="white" />
                  Lock
                </Button>
              </VaultLockConfigModal>
            )}
            {/* @ts-expect-error - Button component is not typed */}
            <Button variant="outline" size="32">
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
