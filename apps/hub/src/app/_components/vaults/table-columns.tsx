/* eslint-disable import/no-unresolved */
import { OptionsIcon, TimeIcon } from '@status-im/icons/12'
import { LockedIcon, UnlockedIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { createColumnHelper } from '@tanstack/react-table'

import { formatKarma, formatSNT } from '../../../utils/currency'

import type { Vault } from './types'

export const createVaultTableColumns = (data: Vault[]) => {
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
        return (
          <div className="flex items-center justify-end gap-4">
            {row.original.locked ? (
              // @ts-expect-error - Button component is not typed
              <Button variant="primary" size="32" className="text-[13px]">
                <TimeIcon />
                Extend lock time
              </Button>
            ) : (
              // @ts-expect-error - Button component is not typed
              <Button variant="primary" size="32" className="text-[13px]">
                <LockedIcon fill="white" />
                Lock
              </Button>
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
