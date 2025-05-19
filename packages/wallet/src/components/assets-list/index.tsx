'use client'

import { useMemo } from 'react'

import { Button } from '@status-im/components'
import { match, P } from 'ts-pattern'

import { CurrencyAmount } from '../currency-amount'
import { PercentageChange } from '../percentage-change'
import * as Table from '../table'
import { TokenAmount } from '../token-amount'

import type { ApiOutput } from '../../data'

type Props = {
  assets: ApiOutput['assets']['all']['assets']
  pathname?: string
  onSelect: (url: string, options?: { scroll?: boolean }) => void
  searchParams: URLSearchParams
  clearSearch: () => void
}

const AssetsList = (props: Props) => {
  const { assets, pathname, onSelect, searchParams, clearSearch } = props

  const searchParamValue = searchParams.get('search') ?? ''
  const sortParamValue = searchParams.get('sort') ?? ''
  const orderByColumn = sortParamValue.split(',')[0]
  const ascending = sortParamValue.split(',')[1] === 'asc'

  const filteredAssets = useMemo(() => {
    const filtered = assets.filter(asset => {
      if (asset.name) {
        return asset.name.toLowerCase().includes(searchParamValue.toLowerCase())
      } else if (asset.native) {
        return asset.symbol
          .toLowerCase()
          .includes(searchParamValue.toLowerCase())
      } else {
        return (
          asset.contract
            ?.toLowerCase()
            .includes(searchParamValue.toLowerCase()) ?? false
        )
      }
    })

    if (!orderByColumn) return filtered

    return [...filtered].sort((a, b) => {
      const comparison = match(orderByColumn)
        .with('name', () => (a.name || '').localeCompare(b.name || ''))
        .with(
          'price',
          () => Number(a.price_eur || '0') - Number(b.price_eur || '0'),
        )
        .with(
          '24h',
          () =>
            (a.price_percentage_24h_change || 0) -
            (b.price_percentage_24h_change || 0),
        )
        .with('balance', () => (a.balance || 0) - (b.balance || 0))
        .with(
          'value',
          () => Number(a.total_eur || '0') - Number(b.total_eur || '0'),
        )
        .with(P.string, () => 0)
        .exhaustive()

      return ascending ? comparison : -comparison
    })
  }, [assets, searchParamValue, orderByColumn, ascending])

  return (
    <div className="pb-10">
      <div className="hidden min-h-[calc(100svh-362px)] w-full overflow-auto 2xl:block">
        {filteredAssets.length !== 0 && (
          <Table.Root>
            <Table.Header>
              <Table.HeaderCell>Assets</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>24H%</Table.HeaderCell>
              <Table.HeaderCell>Balance</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
              {filteredAssets.map(asset => {
                const href = `${pathname?.replace(
                  /\/assets\/.*/,
                  '/assets',
                )}/${asset.native ? asset.symbol : asset.contract}`
                const isActive = pathname?.startsWith(href)

                return (
                  <Table.Row
                    key={asset.native ? asset.symbol : asset.contract}
                    aria-selected={isActive}
                    onClick={() => {
                      const search = searchParams.toString()
                      const query = search ? `?${search}` : ''
                      onSelect(`${href}${query}`, { scroll: false })
                    }}
                  >
                    <Table.Cell size={36}>
                      <div className="flex flex-row items-center gap-2">
                        <img
                          className="size-6 rounded-full bg-neutral-10"
                          alt={asset.name}
                          src={asset.icon}
                        />
                        <span className="truncate">{asset.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell size={36}>
                      <CurrencyAmount
                        value={asset.price_eur}
                        format="precise"
                      />
                    </Table.Cell>
                    <Table.Cell size={36}>
                      <PercentageChange
                        percentage={asset.price_percentage_24h_change}
                      />
                    </Table.Cell>
                    <Table.Cell size={36}>
                      <TokenAmount value={asset.balance} format="precise" />
                    </Table.Cell>
                    <Table.Cell size={36}>
                      <CurrencyAmount
                        value={asset.total_eur}
                        format="standard"
                      />
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table.Root>
        )}
        {filteredAssets.length === 0 && (
          <div className="flex flex-1 flex-col items-center py-8">
            <h2 className="pt-[68px] text-15 font-semibold text-neutral-100 first-line:mb-0.5">
              No assets found
            </h2>
            <p className="mb-5 text-13 font-regular text-neutral-100">
              We didn&apos;t find any assets that match your search
            </p>
            <Button
              variant="outline"
              target="_blank"
              size="32"
              rel="noopener noreferrer"
              onClick={() => clearSearch()}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
      <div className="flex min-h-[calc(100svh-362px)] w-full overflow-auto 2xl:hidden">
        <div className="w-full">
          {filteredAssets.map(asset => {
            const href = `${pathname?.replace(
              /\/assets\/.*/,
              '/assets',
            )}/${asset.native ? asset.symbol : asset.contract}`

            return (
              <button
                key={asset.native ? asset.symbol : asset.contract}
                className="flex w-full items-center justify-between rounded-12 px-3 py-2 transition-colors focus-within:bg-neutral-5 hover:bg-neutral-5"
                onClick={() => {
                  const search = searchParams.toString()
                  const query = search ? `?${search}` : ''
                  onSelect(`${href}${query}`, { scroll: false })
                }}
              >
                <div className="flex items-center gap-2">
                  <img
                    className="size-8 rounded-full"
                    alt={asset.name}
                    src={asset.icon}
                  />
                  <div className="flex min-w-0 flex-col items-start text-left">
                    <span className="w-full max-w-40 truncate text-15 font-600 sm:max-w-full">
                      {asset.name}
                    </span>
                    <span className="flex text-13 font-400 text-neutral-50">
                      <TokenAmount value={asset.balance} format="precise" />
                      {asset.symbol}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-15 font-600">
                    <CurrencyAmount value={asset.total_eur} format="standard" />
                  </span>
                  <span className="flex text-13 font-400 text-neutral-50">
                    <PercentageChange
                      percentage={asset.price_percentage_24h_change}
                      variant="with-value-difference"
                      value={
                        (Number(asset.balance) *
                          Number(asset.price_eur) *
                          asset.price_percentage_24h_change) /
                        100
                      }
                      className="ml-1"
                    />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { AssetsList }
