/* eslint-disable import/no-unresolved */
'use client'

import { useMemo } from 'react'

import { AddCircleIcon } from '@status-im/icons/12'
import { Button } from '@status-im/status-network/components'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useVaultStateContext } from '../../_hooks/vault-state-context'
import { createVaultTableColumns } from './table-columns'

import type { Vault, VaultColumnMeta } from './types'

const vaults: Vault[] = [
  {
    id: '1',
    address: '0x9A8A9958ac1B70c49ccE9693CCb0230f13F63505',
    staked: 100000000n,
    unlocksIn: 356,
    boost: 0.03,
    karma: 99.69,
    locked: true,
  },
  {
    id: '2',
    address: '0x9A8A9958ac1B70c49ccE9693CCb0230f13F63505',
    staked: 100000000n,
    unlocksIn: null,
    boost: 0.02,
    potentialBoost: 0.29,
    karma: 69.69,
    locked: false,
  },
]

export const VaultsTable = () => {
  const columns = useMemo(() => createVaultTableColumns(vaults), [])
  const data = useMemo(() => vaults ?? [], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { send: sendVaultEvent } = useVaultStateContext()

  const handleAddVaultModal = () => {
    sendVaultEvent({ type: 'START_CREATE_VAULT' })
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-center gap-[12px]">
        <h2 className="whitespace-pre text-[19px] font-semibold leading-[1.35] tracking-[-0.304px] text-neutral-100">
          My vaults
        </h2>
        {/* @ts-expect-error - Button component is not typed */}
        <Button variant="outline" size="32" onClick={handleAddVaultModal}>
          <AddCircleIcon />
          Add vault
        </Button>
      </div>

      <div className="relative shrink-0 overflow-clip rounded-16 border border-solid border-neutral-10 bg-white-100">
        <table className="w-full border-collapse">
          <thead className="h-[40px] border-b border-solid border-neutral-10 bg-neutral-5">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`box-border px-[12px] ${
                      (header.column.columnDef.meta as any)?.headerClassName ||
                      'text-left'
                    }`}
                  >
                    <span className="text-[13px] font-medium text-neutral-50">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-10">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="transition-colors hover:bg-neutral-5">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={`box-border px-[12px] py-[11px] ${
                      (cell.column.columnDef.meta as VaultColumnMeta)
                        ?.cellClassName || 'text-left'
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-solid border-neutral-10 bg-neutral-5">
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <td
                    key={header.id}
                    className={`box-border px-[12px] py-[7px] ${
                      (header.column.columnDef.meta as any)?.cellClassName ||
                      'text-left'
                    }`}
                  >
                    {header.column.columnDef.footer
                      ? flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )
                      : null}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  )
}
