import { Suspense } from 'react'

import { Button, Tooltip } from '@status-im/components'
import { BuyIcon, ReceiveBlurIcon } from '@status-im/icons/20'
import {
  Balance,
  CurrencyAmount,
  NetworkBreakdown,
  StickyHeaderContainer,
  TokenLogo,
} from '@status-im/wallet/components'
import { cx } from 'class-variance-authority'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ErrorBoundary } from 'react-error-boundary'

import { getAPIClient } from '../../../../..//data/api'
import { BuyCryptoDrawer } from '../../../../_components/buy-crypto-drawer'
import { portfolioComponents } from '../../../../_components/content'
import { ReceiveCryptoDrawer } from '../../../../_components/receive-crypto-drawer'
import { TokenAmount } from '../../../../_components/token-amount'
import { Chart } from '../_components/chart'
import { Loading } from '../_components/chart/loading'

import type { ApiOutput, NetworkType } from '@status-im/wallet/data'

// export const experimental_ppr = true

type Props = {
  params: Promise<{
    address: string
    ticker: string
  }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function AssetDetailPage(props: Props) {
  const { params } = props
  const { address, ticker: slug } = await params

  const searchParams = await props.searchParams
  const networks = searchParams['networks']?.split(',') ?? ['ethereum']
  const keyHash = JSON.stringify({
    route: 'ticker',
    networks,
  })

  return (
    // <Suspense
    //   // note: comment to prevent loading fallback for the whole slot
    //   key={keyHash}
    //   fallback={<div>Loading...</div>}
    // >
    <Token
      slug={slug}
      address={address}
      networks={networks as NetworkType[]}
      keyHash={keyHash}
    />
    //  </Suspense>
  )
}

async function Token({
  slug,
  address,
  networks,
  keyHash,
}: {
  slug: string
  address: string
  networks: NetworkType[]
  keyHash: string
}) {
  const apiClient = await getAPIClient()

  let token: ApiOutput['assets']['token'] | ApiOutput['assets']['nativeToken']

  if (slug.startsWith('0x')) {
    token = await apiClient.assets.token({
      address: address,
      networks: networks as NetworkType[],
      contract: slug,
    })
  } else if (slug.toUpperCase() === 'ETH') {
    token = await apiClient.assets.nativeToken({
      address,
      networks: networks as NetworkType[],
      symbol: slug.toUpperCase(),
    })
  } else {
    notFound()
  }

  const metadata = Object.values(token.assets)[0].metadata
  const uppercasedTicker = token.summary.symbol
  const icon = token.summary.icon

  return (
    <StickyHeaderContainer
      className="-translate-x-0 !py-3 !pl-3 pr-[50px] 2xl:w-auto 2xl:!px-12 2xl:!py-4"
      leftSlot={
        <TokenLogo
          variant="small"
          name={token.summary.name}
          ticker={uppercasedTicker}
          icon={icon}
        />
      }
      rightSlot={
        <div className="flex items-center gap-1 pt-px">
          <BuyCryptoDrawer>
            <Button size="32" iconBefore={<BuyIcon />}>
              <span className="block max-w-20 truncate">
                Buy {token.summary.name}
              </span>
            </Button>
          </BuyCryptoDrawer>
          <ReceiveCryptoDrawer>
            <Button size="32" iconBefore={<ReceiveBlurIcon />}>
              Receive
            </Button>
          </ReceiveCryptoDrawer>
        </div>
      }
    >
      <div className="-mt-8 grid gap-10 p-4 pt-0 2xl:mt-0 2xl:p-12 2xl:pt-0">
        <div>
          <TokenLogo
            name={token.summary.name}
            ticker={uppercasedTicker}
            icon={icon}
          />
          <div className="my-6 2xl:mt-0">
            <Balance variant="token" summary={token.summary} />
          </div>

          <div className="flex items-center gap-1">
            <BuyCryptoDrawer>
              <Button size="32" iconBefore={<BuyIcon />}>
                Buy {token.summary.name}
              </Button>
            </BuyCryptoDrawer>
            <ReceiveCryptoDrawer>
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

        {token.summary.total_balance > 0 && <NetworkBreakdown token={token} />}

        <ErrorBoundary fallback={<div>Error loading chart</div>}>
          <Suspense
            key={keyHash}
            fallback={
              <div className="mt-8">
                <Loading />
              </div>
            }
          >
            <AssetChart
              address={address}
              slug={slug}
              symbol={token.summary.symbol}
            />
          </Suspense>
        </ErrorBoundary>

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
                  index < 4 && '2xl:border-b'
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
            <p className="text-15 font-600">What is {uppercasedTicker}?</p>

            <MDXRemote
              source={metadata.about || ''}
              components={portfolioComponents}
            />
          </div>
        </div>
      </div>
    </StickyHeaderContainer>
  )
}

async function AssetChart({
  address,
  slug,
  symbol,
}: {
  address: string
  slug: string
  symbol: string
}) {
  let priceChart:
    | ApiOutput['assets']['tokenPriceChart']
    | ApiOutput['assets']['nativeTokenPriceChart']
  let balanceChart: ApiOutput['assets']['tokenBalanceChart']

  const apiClient = await getAPIClient()

  if (slug.startsWith('0x')) {
    priceChart = await apiClient.assets.tokenPriceChart({
      symbol,
      days: '1',
    })

    balanceChart = await apiClient.assets.tokenBalanceChart({
      address,
      networks: ['ethereum'],
      contract: slug,
      days: '30',
    })
  } else if (slug.toUpperCase() === 'ETH') {
    priceChart = await apiClient.assets.nativeTokenPriceChart({
      symbol: slug.toUpperCase(),
      days: '1',
    })

    balanceChart = await apiClient.assets.nativeTokenBalanceChart({
      address,
      networks: ['ethereum'],
      days: '30',
    })
  } else {
    notFound()
  }

  return <Chart price={priceChart} balance={balanceChart} />
}
