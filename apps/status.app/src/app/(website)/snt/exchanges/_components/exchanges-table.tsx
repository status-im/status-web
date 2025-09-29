'use client'

import Image from 'next/image'

import { Table } from '~components/table'

import type { Ticker } from '~server/services/coingecko'

const formatCurrency = (n: number) => {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

const getRelativeTime = (date: string) => {
  const timestamp = Date.parse(date)
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'always',
    style: 'short',
  })

  if (days > 0) {
    return formatter.format(-Math.abs(days), 'day')
  }

  if (hours > 0) {
    return formatter.format(-Math.abs(hours), 'hour')
  }

  if (minutes > 0) {
    return formatter.format(-Math.abs(minutes), 'minutes')
  }

  return 'recently'
}

type Props = {
  tickers: {
    data: Ticker[]
    totalVolume: number
  }
}

export const ExchangesTable = ({ tickers }: Props) => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderCell minWidth={140}>Exchange</Table.HeaderCell>
        <Table.HeaderCell>Pair</Table.HeaderCell>
        <Table.HeaderCell>Price</Table.HeaderCell>
        <Table.HeaderCell>Spread</Table.HeaderCell>
        <Table.HeaderCell>+2% Depth</Table.HeaderCell>
        <Table.HeaderCell>-2% Depth</Table.HeaderCell>
        <Table.HeaderCell>24h volume</Table.HeaderCell>
        <Table.HeaderCell>Volume %</Table.HeaderCell>
        <Table.HeaderCell>Last update</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {tickers.data.map((ticker: Ticker) => (
          <Table.Row
            key={ticker.base + ticker.target + ticker.market.name}
            onClick={() =>
              window.open(ticker.trade_url, '_blank', 'noopener,noreferrer')
            }
          >
            <Table.Cell
              size={36}
              className="truncate whitespace-nowrap align-middle"
            >
              <div className="flex flex-row items-stretch gap-2">
                <Image
                  src={ticker.market.logo}
                  alt={ticker.market.name}
                  width={20}
                  height={20}
                />
                {ticker.market.name}
              </div>
            </Table.Cell>

            <Table.Cell className="text-neutral-50">
              {ticker.base}/{ticker.target}
            </Table.Cell>
            <Table.Cell className="text-neutral-50">
              ${ticker.converted_last.usd.toFixed(8)}
            </Table.Cell>
            <Table.Cell className="text-neutral-50">
              {ticker.bid_ask_spread_percentage?.toFixed(2)}%
            </Table.Cell>
            <Table.Cell className="text-neutral-50">
              {formatCurrency(ticker.cost_to_move_up_usd)}
            </Table.Cell>
            <Table.Cell className="text-neutral-50">
              {formatCurrency(ticker.cost_to_move_down_usd)}
            </Table.Cell>
            <Table.Cell className="text-neutral-50">
              {formatCurrency(ticker.converted_volume.usd)}
            </Table.Cell>
            <Table.Cell className="text-neutral-50">
              {(
                (ticker.converted_volume.usd / tickers.totalVolume) *
                100
              ).toFixed(2)}
              %
            </Table.Cell>
            <Table.Cell className="text-neutral-50">
              {getRelativeTime(ticker.last_fetch_at)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}
