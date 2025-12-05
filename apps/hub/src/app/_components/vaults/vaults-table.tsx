'use client'

import { useCallback, useMemo, useState } from 'react'

import { Skeleton } from '@status-im/components'
import { AddCircleIcon } from '@status-im/icons/12'
import { Button } from '@status-im/status-network/components'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAccount, useChainId } from 'wagmi'

import { useCreateVault } from '~hooks/useCreateVault'
import { useEmergencyModeEnabled } from '~hooks/useEmergencyModeEnabled'
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
    <thead className="h-10 border-b border-solid border-neutral-10 bg-neutral-5">
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className={`box-border px-3 ${getHeaderClassName(header.column.columnDef.meta as VaultColumnMeta)}`}
            >
              <span className="text-13 font-medium text-neutral-50">
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
              className={`box-border px-3 py-[11px] ${getCellClassName(cell.column.columnDef.meta as VaultColumnMeta)}`}
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
              className={`box-border px-3 py-[7px] ${getCellClassName(header.column.columnDef.meta as VaultColumnMeta)}`}
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

function VaultsTableSkeleton() {
  return (
    <div className="max-h-[600px] overflow-auto">
      <div className="min-w-[800px]">
        <table className="w-full border-collapse">
          <thead className="h-10 border-b border-solid border-neutral-10 bg-neutral-5">
            <tr>
              <th className="box-border px-3 text-left">
                <span className="text-13 font-medium text-neutral-50">
                  Vault name
                </span>
              </th>
              <th className="box-border px-3 text-left">
                <span className="text-13 font-medium text-neutral-50">
                  Staked
                </span>
              </th>
              <th className="box-border px-3 text-left">
                <span className="text-13 font-medium text-neutral-50">
                  Boost
                </span>
              </th>
              <th className="box-border px-3 text-left">
                <span className="text-13 font-medium text-neutral-50">
                  Multiplier points
                </span>
              </th>
              <th className="box-border px-3 text-right">
                <span className="text-13 font-medium text-neutral-50">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-10">
            {Array.from({ length: 3 }).map((_, index) => (
              <tr key={index} className="h-[60px]">
                <td className="box-border px-3 py-2.5">
                  <Skeleton height={20} width={120} className="rounded-6" />
                </td>
                <td className="box-border px-3 py-2.5">
                  <Skeleton height={20} width={100} className="rounded-6" />
                </td>
                <td className="box-border px-3 py-2.5">
                  <Skeleton height={20} width={60} className="rounded-6" />
                </td>
                <td className="box-border px-3 py-2.5">
                  <Skeleton height={20} width={80} className="rounded-6" />
                </td>
                <td className="box-border px-3 py-2.5 text-right">
                  <Skeleton
                    height={32}
                    width={80}
                    className="ml-auto rounded-6"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

type VaultsTableProps = {
  isLoading?: boolean
}

export function VaultsTable({ isLoading }: VaultsTableProps) {
  const [openModalVaultId, setOpenModalVaultId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const { data: vaultDataList } = useStakingVaults()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { mutate: createVault } = useCreateVault()
  const { data: emergencyModeEnabled } = useEmergencyModeEnabled()

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
        chainId,
        openModalVaultId,
        setOpenModalVaultId: handleSetOpenModalVaultId,
        emergencyModeEnabled,
        isConnected,
        openDropdownId,
        setOpenDropdownId,
      }),
    [
      vaultDataList,
      chainId,
      openModalVaultId,
      handleSetOpenModalVaultId,
      emergencyModeEnabled,
      isConnected,
      openDropdownId,
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
      <div className="flex items-center gap-3 lg:justify-between">
        <h2 className="text-19 font-semibold leading-none text-neutral-100">
          My vaults
        </h2>
        {isConnected && (
          <Button
            variant="outline"
            size="32"
            onClick={() => createVault()}
            disabled={Boolean(emergencyModeEnabled)}
          >
            <AddCircleIcon />
            <span className="whitespace-nowrap">Add vault</span>
          </Button>
        )}
      </div>

      <div className="relative mb-4 w-full overflow-hidden rounded-16 border border-solid border-neutral-10 bg-white-100">
        {isLoading ? (
          <VaultsTableSkeleton />
        ) : !isConnected ? (
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
              <p className="mt-2 text-13 text-neutral-40">
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
