import { Button, Tooltip } from '@status-im/components'
import { BuyIcon, ReceiveBlurIcon } from '@status-im/icons/20'
import {
  Balance,
  CurrencyAmount,
  StickyHeaderContainer,
} from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'class-variance-authority'

import type { NetworkType } from '@status-im/wallet/data'

type TokenResponse = {
  summary: {
    name: string
    symbol: string
    icon: string
  }
  assets: Record<
    NetworkType,
    {
      metadata: {
        market_cap: number
        fully_dilluted: number
        circulation: number
        total_supply: number
      }
    }
  >
}

type Props = {
  ticker: string
}

const Token = (props: Props) => {
  const { ticker } = props
  const { data: token, isLoading } = useQuery<TokenResponse>({
    queryKey: ['token', ticker],
    queryFn: async () => {
      const url = new URL('http://localhost:3030/api/trpc/assets.token')
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            networks: [
              'ethereum',
              'optimism',
              'arbitrum',
              'base',
              'polygon',
              'bsc',
            ] as NetworkType[],
            contract: ticker,
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

  if (isLoading || !token) {
    return <p>Loading</p>
  }

  const typedToken = token as {
    summary: {
      name: string
      symbol: string
      icon: string
      total_balance: number
      total_eur: number
      total_eur_24h_change: number
      total_percentage_24h_change: number
    }
    assets: Record<
      NetworkType,
      {
        balance: number
        eur: number
        eur_24h_change: number
        percentage_24h_change: number
        metadata: {
          market_cap: number
          fully_dilluted: number
          circulation: number
          total_supply: number
        }
      }
    >
  }

  const metadata = Object.values(typedToken.assets)[0].metadata
  //   const uppercasedTicker = typedToken.summary.symbol
  //   const icon = typedToken.summary.icon

  return (
    <StickyHeaderContainer
      className="-translate-x-0 !py-3 !pl-3 pr-[50px] 2xl:w-auto 2xl:!px-12 2xl:!py-4"
      leftSlot={
        // <TokenLogo
        //   variant="small"
        //   name={typedToken.summary.name}
        //   ticker={uppercasedTicker}
        //   icon={icon}
        // />
        <p>Token logo</p>
      }
      rightSlot={
        <div className="flex items-center gap-1 pt-px">
          <Button size="32" iconBefore={<BuyIcon />}>
            <span className="block max-w-20 truncate">
              Buy {typedToken.summary.name}
            </span>
          </Button>
          <Button size="32" iconBefore={<ReceiveBlurIcon />}>
            Receive
          </Button>
        </div>
      }
    >
      <div className="-mt-8 grid gap-10 p-4 pt-0 2xl:mt-0 2xl:p-12 2xl:pt-0">
        <div>
          {/* <TokenLogo
              name={typedToken.summary.name}
              ticker={uppercasedTicker}
              icon={icon}
            /> */}
          <p>Token Logo</p>
          <div className="my-6 2xl:mt-0">
            <Balance variant="token" summary={typedToken.summary} />
          </div>

          <div className="flex items-center gap-1">
            <Button size="32" iconBefore={<BuyIcon />}>
              Buy {typedToken.summary.name}
            </Button>
            <Button
              size="32"
              variant="outline"
              iconBefore={<ReceiveBlurIcon />}
            >
              Receive
            </Button>
          </div>
        </div>

        {typedToken.summary.total_balance > 0 && (
          //   <NetworkBreakdown token={typedToken} />
          <p>Network breakdown</p>
        )}

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
                  <CurrencyAmount
                    value={metadata.circulation}
                    format="compact"
                  />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.circulation}
                    format="standard"
                  />
                ),
              },
              {
                label: 'Total supply',
                value: (
                  <CurrencyAmount
                    value={metadata.total_supply}
                    format="compact"
                  />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.total_supply}
                    format="standard"
                  />
                ),
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
        </div>
      </div>
    </StickyHeaderContainer>
  )
}

export { Token }
