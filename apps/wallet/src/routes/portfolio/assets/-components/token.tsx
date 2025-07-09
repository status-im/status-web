import { useEffect, useState } from 'react'

import { Button, Tooltip } from '@status-im/components'
import { ArrowLeftIcon, BuyIcon, ReceiveBlurIcon } from '@status-im/icons/20'
import {
  Balance,
  Chart,
  CurrencyAmount,
  NetworkBreakdown,
  ReceiveCryptoDrawer,
  StickyHeaderContainer,
  TokenAmount,
  TokenLogo,
} from '@status-im/wallet/components'
import { useCopyToClipboard } from '@status-im/wallet/hooks'
import { useQuery } from '@tanstack/react-query'
import { Link, notFound } from '@tanstack/react-router'
import { cx } from 'class-variance-authority'

import { renderMarkdown } from '@/lib/markdown'

import type { Account } from '@status-im/wallet/components'
import type { ApiOutput } from '@status-im/wallet/data'

type Props = {
  address: string
  ticker: string
}

const NETWORKS = [
  'ethereum',
  'optimism',
  'arbitrum',
  'base',
  'polygon',
  'bsc',
] as const

const Loading = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="text-neutral-50">Loading...</div>
  </div>
)

const Token = (props: Props) => {
  const { ticker, address } = props
  const [markdownContent, setMarkdownContent] = useState<React.ReactNode>(null)
  const [, copy] = useCopyToClipboard()

  const token = useQuery<
    ApiOutput['assets']['token'] | ApiOutput['assets']['nativeToken']
  >({
    queryKey: ['token', ticker],
    queryFn: async () => {
      const endpoint = ticker.startsWith('0x')
        ? 'assets.token'
        : 'assets.nativeToken'
      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/${endpoint}`,
      )
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address,
            networks: NETWORKS,
            ...(ticker.startsWith('0x')
              ? { contract: ticker }
              : { symbol: ticker }),
          },
        }),
      )

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch.')
      }

      const body = await response.json()
      return body.result.data.json
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: typedToken, isLoading } = token

  useEffect(() => {
    const processMarkdown = async () => {
      if (typedToken) {
        const metadata = Object.values(typedToken.assets)[0].metadata
        const content = await renderMarkdown(
          metadata.about || 'No description available.',
        )
        setMarkdownContent(content)
      }
    }
    processMarkdown()
  }, [typedToken])

  if (isLoading || !typedToken) {
    return <p>Loading</p>
  }

  const metadata = Object.values(typedToken.assets)[0].metadata
  const uppercasedTicker = typedToken.summary.symbol
  const icon = typedToken.summary.icon

  const account: Account = {
    address,
    name: 'Account 1',
    emoji: '🍑',
    color: 'magenta',
  }

  return (
    <StickyHeaderContainer
      className="-translate-x-0 !py-3 !pl-3 pr-[50px] 2xl:w-auto 2xl:!px-12 2xl:!py-4"
      leftSlot={
        <TokenLogo
          variant="small"
          name={typedToken.summary.name}
          ticker={uppercasedTicker}
          icon={icon}
        />
      }
      rightSlot={
        <div className="flex items-center gap-1 pt-px">
          <Button size="32" iconBefore={<BuyIcon />}>
            <span className="block max-w-20 truncate">
              Buy {typedToken.summary.name}
            </span>
          </Button>
          <ReceiveCryptoDrawer account={account} onCopy={copy}>
            <Button
              size="32"
              iconBefore={<ReceiveBlurIcon />}
              variant="outline"
            >
              Receive
            </Button>
          </ReceiveCryptoDrawer>
        </div>
      }
    >
      <Link
        to="/portfolio/assets"
        viewTransition
        className="z-30 flex items-center gap-1 p-4 font-600 text-neutral-50 transition-colors hover:text-neutral-60 xl:hidden 2xl:mt-0 2xl:p-12 2xl:pt-0"
      >
        <ArrowLeftIcon />
        Back
      </Link>
      <div className="grid gap-10 p-4 pt-0 2xl:mt-0 2xl:p-12 2xl:pt-0">
        <div>
          <TokenLogo
            name={typedToken.summary.name}
            ticker={uppercasedTicker}
            icon={icon}
          />

          <div className="my-6 2xl:mt-0">
            <Balance variant="token" summary={typedToken.summary} />
          </div>

          <div className="flex items-center gap-1">
            <Button size="32" iconBefore={<BuyIcon />} variant="primary">
              Buy {typedToken.summary.name}
            </Button>

            <ReceiveCryptoDrawer account={account} onCopy={copy}>
              <Button
                size="32"
                variant="outline"
                iconBefore={<ReceiveBlurIcon />}
              >
                Receive
              </Button>
            </ReceiveCryptoDrawer>
          </div>
        </div>

        {typedToken.summary.total_balance > 0 && (
          <NetworkBreakdown token={typedToken} />
        )}

        <AssetChart
          address={address}
          slug={ticker}
          symbol={typedToken.summary.symbol}
        />

        <div>
          <div className="grid grid-cols-2 2xl:grid-cols-4">
            {[
              {
                label: 'Market Cap',
                value: (
                  <CurrencyAmount
                    value={metadata.market_cap}
                    format="compact"
                  />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.market_cap}
                    format="standard"
                  />
                ),
              },
              {
                label: 'Fully diluted',
                value: (
                  <CurrencyAmount
                    value={metadata.fully_dilluted}
                    format="compact"
                  />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.fully_dilluted}
                    format="standard"
                  />
                ),
              },
              {
                label: 'Circulation',
                value: (
                  <TokenAmount value={metadata.circulation} format="compact" />
                ),
                tooltip: (
                  <TokenAmount value={metadata.circulation} format="standard" />
                ),
              },
              {
                label: 'Total supply',
                value: (
                  <TokenAmount value={metadata.total_supply} format="compact" />
                ),
                tooltip: (
                  <TokenAmount
                    value={metadata.total_supply}
                    format="standard"
                  />
                ),
              },
              {
                label: 'All time high',
                value: (
                  <CurrencyAmount
                    value={metadata.all_time_high}
                    format="standard"
                  />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.all_time_high}
                    format="standard"
                  />
                ),
              },
              {
                label: 'All time low',
                value: (
                  <CurrencyAmount
                    value={metadata.all_time_low}
                    format="standard"
                  />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.all_time_low}
                    format="standard"
                  />
                ),
              },
              {
                label: '24h Volume',
                value: (
                  <TokenAmount value={metadata.volume_24} format="compact" />
                ),
                tooltip: (
                  <TokenAmount value={metadata.volume_24} format="standard" />
                ),
              },
              {
                label: 'Rank by Mcap',
                value: metadata?.rank_by_market_cap,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={cx(
                  'border-dashed border-neutral-10 py-4',
                  index % 2 !== 0 && 'pl-4',
                  index % 2 !== 1 && 'border-r pr-4',
                  index % 4 !== 3 && '2xl:border-r 2xl:pr-4',
                  index < 6 && 'border-b',
                  index < 4 && '2xl:border-b',
                )}
              >
                <Tooltip content={item.tooltip} side="top">
                  <div>
                    <div className="text-13 font-regular text-neutral-50">
                      {item.label}
                    </div>
                    <div className="text-13 font-medium text-neutral-100">
                      {item.value}
                    </div>
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
          <div className="mt-5 flex-col gap-2">
            <div className="text-neutral-100">{markdownContent}</div>
          </div>
        </div>
      </div>
    </StickyHeaderContainer>
  )
}

function AssetChart({
  address,
  slug,
  symbol,
}: {
  address: string
  slug: string
  symbol: string
}) {
  const isContractToken = slug.startsWith('0x')
  const isETH = slug.toUpperCase() === 'ETH'

  if (!isContractToken && !isETH) {
    notFound()
  }

  const priceChart = useQuery<
    | ApiOutput['assets']['tokenPriceChart']
    | ApiOutput['assets']['nativeTokenPriceChart']
  >({
    queryKey: ['priceChart', symbol, slug],
    queryFn: async () => {
      const endpoint = isContractToken
        ? 'assets.tokenPriceChart'
        : 'assets.nativeTokenPriceChart'

      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/${endpoint}`,
      )

      const input = {
        json: {
          symbol: isContractToken ? symbol : slug.toUpperCase(),
          days: '1',
        },
      }

      url.searchParams.set('input', JSON.stringify(input))

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch price chart data.')
      }

      const body = await response.json()
      return body.result.data.json
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const balanceChart = useQuery<ApiOutput['assets']['tokenBalanceChart']>({
    queryKey: ['balanceChart', address, slug],
    queryFn: async () => {
      const endpoint = isContractToken
        ? 'assets.tokenBalanceChart'
        : 'assets.nativeTokenBalanceChart'

      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/${endpoint}`,
      )

      const input = {
        json: {
          address,
          networks: NETWORKS,
          days: '30',
          ...(isContractToken && { contract: slug }),
        },
      }

      url.searchParams.set('input', JSON.stringify(input))

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch balance chart data.')
      }

      const body = await response.json()
      return body.result.data.json
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  if (priceChart.isLoading || balanceChart.isLoading) {
    return <Loading />
  }

  if (priceChart.error || balanceChart.error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-danger-50">Error loading chart data</div>
      </div>
    )
  }

  return <Chart price={priceChart.data} balance={balanceChart.data} />
}

export { Token }
