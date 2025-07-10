import { useEffect, useState } from 'react'

import { Button, SegmentedControl, Tooltip } from '@status-im/components'
import {
  ArrowLeftIcon,
  BuyIcon,
  ReceiveBlurIcon,
  SendBlurIcon,
} from '@status-im/icons/20'
import {
  type Account,
  Balance,
  BuyCryptoDrawer,
  type ChartDataType,
  type ChartTimeFrame,
  CurrencyAmount,
  DEFAULT_DATA_TYPE,
  DEFAULT_TIME_FRAME,
  NetworkBreakdown,
  ReceiveCryptoDrawer,
  type SendAssetsFormData,
  SendAssetsModal,
  StickyHeaderContainer,
  TIME_FRAMES,
  TokenAmount,
  TokenLogo,
} from '@status-im/wallet/components'
import { useCopyToClipboard } from '@status-im/wallet/hooks'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { cx } from 'class-variance-authority'

import { useEthBalance } from '@/hooks/use-eth-balance'
import { renderMarkdown } from '@/lib/markdown'
import { apiClient } from '@/providers/api-client'
import { useWallet } from '@/providers/wallet-context'

import { AssetChart } from './asset-chart'

import type { ApiOutput, NetworkType } from '@status-im/wallet/data'

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

const Token = (props: Props) => {
  const { ticker, address } = props
  const [markdownContent, setMarkdownContent] = useState<React.ReactNode>(null)
  const [, copy] = useCopyToClipboard()

  const [activeDataType, setActiveDataType] =
    useState<ChartDataType>(DEFAULT_DATA_TYPE)
  const [activeTimeFrame, setActiveTimeFrame] =
    useState<ChartTimeFrame>(DEFAULT_TIME_FRAME)
  const { currentWallet } = useWallet()
  const [gasInput, setGasInput] = useState<{
    to: string
    value: string
  } | null>(null)

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

  const needsEthBalance = typedToken?.summary.symbol !== 'ETH'

  const ethBalanceQuery = useEthBalance(address, needsEthBalance)

  const ethBalance = needsEthBalance
    ? ethBalanceQuery.data?.summary.total_balance || 0
    : typedToken.summary.total_balance

  // Get gas fees for the current network
  const gasFeeQuery = useQuery({
    queryKey: ['gas-fees', address, gasInput?.to, gasInput?.value],
    queryFn: async ({ queryKey }) => {
      const [, from, to, value] = queryKey as [string, string, string, string]

      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/nodes.getFeeRate`,
      )

      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            network: 'ethereum',
            params: { from, to, value },
          },
        }),
      )

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to fetch gas fees')

      const body = await response.json()
      return body.result.data.json
    },
    enabled: !!gasInput?.to && !!gasInput?.value && !!address,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const prepareGasEstimate = (to: string, value: string) => {
    setGasInput({ to, value })
  }

  const handleOpenTab = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url })
    } else {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

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

  const asset = {
    name: typedToken.summary.name,
    icon,
    totalBalance: typedToken.summary.total_balance,
    totalBalanceEur: typedToken.summary.total_eur,
    contractAddress: ticker.startsWith('0x') ? ticker : undefined,
    symbol: typedToken.summary.symbol,
    ethBalance,
    network: (Object.keys(typedToken.assets)[0] ?? 'ethereum') as NetworkType,
  }

  // Mock wallet data. Replace with actual wallet data from the user's account.
  const account: Account = {
    address,
    name: 'Account 1',
    emoji: '🍑',
    color: 'magenta',
  }

  const signTransaction = async (
    formData: SendAssetsFormData & { password: string },
  ) => {
    const amountHex = BigInt(
      Math.floor(parseFloat(formData.amount) * 1e18),
    ).toString(16)

    const result = await apiClient.wallet.account.ethereum.send.mutate({
      amount: amountHex,
      toAddress: formData.to,
      fromAddress: address,
      password: formData.password,
      walletId: currentWallet?.id || '',
      gasLimit: gasFeeQuery.data.txParams.gasLimit.replace(/^0x/, ''),
      maxFeePerGas: gasFeeQuery.data.txParams.maxFeePerGas.replace(/^0x/, ''),
      maxInclusionFeePerGas:
        gasFeeQuery.data.txParams.maxPriorityFeePerGas.replace(/^0x/, ''),
    })

    if (!result.id || !result.id.txid) {
      throw new Error('Transaction failed')
    }

    return result.id.txid
  }

  const verifyPassword = async (inputPassword: string): Promise<boolean> => {
    if (!currentWallet?.id) return false
    try {
      await apiClient.wallet.get.query({
        walletId: currentWallet.id,
        password: inputPassword,
      })

      return true
    } catch {
      return false
    }
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
          <BuyCryptoDrawer account={account} onOpenTab={handleOpenTab}>
            <Button size="32" iconBefore={<BuyIcon />}>
              <span className="block max-w-20 truncate">
                Buy {typedToken.summary.name}
              </span>
            </Button>
          </BuyCryptoDrawer>
          <ReceiveCryptoDrawer account={account} onCopy={copy}>
            <Button
              size="32"
              iconBefore={<ReceiveBlurIcon />}
              variant="outline"
            >
              Receive
            </Button>
          </ReceiveCryptoDrawer>
          <SendAssetsModal
            asset={asset}
            account={{
              ...account,
              ethBalance: asset.ethBalance,
            }}
            signTransaction={signTransaction}
            verifyPassword={verifyPassword}
            gasFees={gasFeeQuery.data}
            isLoadingFees={gasFeeQuery.isFetching}
            onEstimateGas={prepareGasEstimate}
          >
            <Button size="32" iconBefore={<SendBlurIcon />}>
              Send
            </Button>
          </SendAssetsModal>
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
            <BuyCryptoDrawer account={account} onOpenTab={handleOpenTab}>
              <Button size="32" iconBefore={<BuyIcon />} variant="primary">
                Buy {typedToken.summary.name}
              </Button>
            </BuyCryptoDrawer>

            <ReceiveCryptoDrawer account={account} onCopy={copy}>
              <Button
                size="32"
                variant="outline"
                iconBefore={<ReceiveBlurIcon />}
              >
                Receive
              </Button>
            </ReceiveCryptoDrawer>
            <SendAssetsModal
              asset={asset}
              account={{
                ...account,
                ethBalance: asset.ethBalance,
              }}
              signTransaction={signTransaction}
              verifyPassword={verifyPassword}
              gasFees={gasFeeQuery.data}
              isLoadingFees={gasFeeQuery.isFetching}
              onEstimateGas={prepareGasEstimate}
            >
              <Button size="32" variant="outline" iconBefore={<SendBlurIcon />}>
                Send
              </Button>
            </SendAssetsModal>
          </div>
        </div>

        {typedToken.summary.total_balance > 0 && (
          <NetworkBreakdown token={typedToken} />
        )}

        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="inline-flex">
              <SegmentedControl.Root
                value={activeDataType}
                onValueChange={value =>
                  setActiveDataType(value as ChartDataType)
                }
                size="24"
              >
                <SegmentedControl.Item value="price">
                  Price
                </SegmentedControl.Item>
                <SegmentedControl.Item value="balance">
                  Balance
                </SegmentedControl.Item>
              </SegmentedControl.Root>
            </div>
            <div className="inline-flex">
              <SegmentedControl.Root
                value={activeTimeFrame}
                onValueChange={value =>
                  setActiveTimeFrame(value as ChartTimeFrame)
                }
                size="24"
              >
                {TIME_FRAMES.map(frame => (
                  <SegmentedControl.Item key={frame} value={frame}>
                    {frame}
                  </SegmentedControl.Item>
                ))}
              </SegmentedControl.Root>
            </div>
          </div>

          <AssetChart
            address={address}
            slug={ticker}
            symbol={typedToken.summary.symbol}
            timeFrame={activeTimeFrame}
            activeDataType={activeDataType}
          />
        </div>

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

export { Token }
