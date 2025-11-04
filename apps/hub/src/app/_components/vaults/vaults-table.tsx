'use client'

import { useCallback, useMemo, useState } from 'react'

import { AddCircleIcon } from '@status-im/icons/12'
import { Button } from '@status-im/status-network/components'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAccount, useReadContract } from 'wagmi'

import { STAKING_MANAGER } from '~constants/index'
import { useCreateVault } from '~hooks/useCreateVault'
import { type StakingVault, useStakingVaults } from '~hooks/useStakingVaults'

import { createVaultTableColumns } from './table-columns'

interface VaultColumnMeta {
  headerClassName?: string
  cellClassName?: string
  footerClassName?: string
}

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

interface TableProps {
  table: ReturnType<typeof useReactTable<StakingVault>>
}

// Simple table components - TanStack Table handles optimization via getCoreRowModel
function TableHeader({ table }: TableProps) {
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

function TableBody({ table }: TableProps) {
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

function TableFooter({ table }: TableProps) {
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
  const { data: vaultDataList } = useStakingVaults()
  const { isConnected } = useAccount()
  const { mutate: createVault } = useCreateVault()

  const { data: emergencyModeEnabled } = useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'emergencyModeEnabled',
    query: {
      staleTime: 60_000, // Consider data fresh for 1 minute
    },
  })

  // Stable callback reference prevents column recreation on every render
  const handleSetOpenModalVaultId = useCallback(
    (vaultId: string | null) => setOpenModalVaultId(vaultId),
    []
  )

  // Memoize columns to prevent recreation unless dependencies change
  const columns = useMemo(
    () =>
      createVaultTableColumns({
        vaults: vaultDataList,
        openModalVaultId,
        setOpenModalVaultId: handleSetOpenModalVaultId,
        emergencyModeEnabled,
        isConnected,
      }),
    [
      vaultDataList,
      openModalVaultId,
      handleSetOpenModalVaultId,
      emergencyModeEnabled,
      isConnected,
    ]
  )

  // Initialize TanStack Table
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
          <Button
            variant="outline"
            size="32"
            onClick={() => createVault()}
            className="w-full sm:w-auto"
          >
            <AddCircleIcon />
            <span className="whitespace-nowrap">Add vault</span>
          </Button>
        )}
      </div>

      <div className="relative w-full overflow-hidden rounded-16 border border-solid border-neutral-10 bg-white-100">
        {!isConnected ? (
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <p className="text-neutral-50">
                Connect your wallet to view your vaults
              </p>
            </div>
          </div>
        ) : vaultDataList && vaultDataList.length === 0 ? (
          <div className="flex items-center justify-center p-12 text-center">
            <div>
              <p className="text-neutral-50">No vaults found</p>
              <p className="mt-2 text-[13px] text-neutral-40">
                Click "Add vault" to create your first vault
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-auto">
            <div className="min-w-[800px]">
              <table className="w-full border-collapse">
                <TableHeader table={table} />
                <TableBody table={table} />
                <TableFooter table={table} />
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
