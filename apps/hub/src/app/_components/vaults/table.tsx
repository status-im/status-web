/* eslint-disable import/no-unresolved */
'use client'

import { useMemo, useState } from 'react'

import { AddCircleIcon } from '@status-im/icons/12'
import { Button } from '@status-im/status-network/components'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAccount } from 'wagmi'

import { useAccountVaults } from '../../_hooks/useAccountVaults'
import { useVaultMutation } from '../../_hooks/useVault'
import { createVaultTableColumns } from './table-columns'

import type { VaultWithAddress } from '../../_hooks/useAccountVaults'
import type { VaultColumnMeta } from './types'

/**
 * Gets the appropriate CSS class for table cell/header based on meta
 */
function getCellClassName(
  meta: VaultColumnMeta | undefined,
  defaultClassName = 'text-left'
): string {
  return meta?.cellClassName || defaultClassName
}

function getHeaderClassName(
  meta: VaultColumnMeta | undefined,
  defaultClassName = 'text-left'
): string {
  return meta?.headerClassName || defaultClassName
}

// ============================================================================
// Sub-components
// ============================================================================

interface TableHeaderProps {
  table: ReturnType<typeof useReactTable<VaultWithAddress>>
}

function TableHeader({ table }: TableHeaderProps) {
  return (
    <thead className="h-[40px] border-b border-solid border-neutral-10 bg-neutral-5">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className={`box-border px-[12px] ${getHeaderClassName(header.column.columnDef.meta as VaultColumnMeta)}`}
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
  )
}

interface TableBodyProps {
  table: ReturnType<typeof useReactTable<VaultWithAddress>>
}

function TableBody({ table }: TableBodyProps) {
  return (
    <tbody className="divide-y divide-neutral-10">
      {table.getRowModel().rows.map(row => (
        <tr key={row.id} className="transition-colors hover:bg-neutral-5">
          {row.getVisibleCells().map(cell => (
            <td
              key={cell.id}
              className={`box-border px-[12px] py-[11px] ${getCellClassName(cell.column.columnDef.meta as VaultColumnMeta)}`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

interface TableFooterProps {
  table: ReturnType<typeof useReactTable<VaultWithAddress>>
}

function TableFooter({ table }: TableFooterProps) {
  return (
    <tfoot className="border-t border-solid border-neutral-10 bg-neutral-5">
      {table.getFooterGroups().map(footerGroup => (
        <tr key={footerGroup.id}>
          {footerGroup.headers.map(header => (
            <td
              key={header.id}
              className={`box-border px-[12px] py-[7px] ${getCellClassName(header.column.columnDef.meta as VaultColumnMeta)}`}
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
  )
}

// ============================================================================
// Main Component
// ============================================================================

export function VaultsTable() {
  const [openModalVaultId, setOpenModalVaultId] = useState<string | null>(null)
  const { data: vaultDataList } = useAccountVaults()
  const { isConnected } = useAccount()
  const { mutate: deployVault } = useVaultMutation()

  const columns = useMemo(
    () =>
      createVaultTableColumns({
        vaults: vaultDataList,
        openModalVaultId,
        setOpenModalVaultId,
      }),
    [openModalVaultId, vaultDataList]
  )

  const table = useReactTable({
    data: vaultDataList ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-[19px] font-semibold leading-[1.35] tracking-[-0.304px] text-neutral-100">
          My vaults
        </h2>
        {isConnected && (
          // @ts-expect-error - Button component is not typed
          <Button
            variant="outline"
            size="32"
            onClick={deployVault}
            className="w-full sm:w-auto"
          >
            <AddCircleIcon />
            <span className="whitespace-nowrap">Add vault</span>
          </Button>
        )}
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-visible rounded-16 border border-solid border-neutral-10 bg-white-100">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse">
            <TableHeader table={table} />
            <TableBody table={table} />
            <TableFooter table={table} />
          </table>
        </div>
      </div>
    </div>
  )
}
