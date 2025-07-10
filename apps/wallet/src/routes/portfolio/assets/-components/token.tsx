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

type TokenData =
  | ApiOutput['assets']['token']
  | ApiOutput['assets']['nativeToken']
type AssetsResponse = ApiOutput['assets']['all']
type AssetData = ApiOutput['assets']['all']['assets'][number]

type Props = {
  address: string
  ticker: string
}

const NETWORKS = ['ethereum'] as const

function matchesAsset(asset: AssetData, ticker: string): boolean {
  if (ticker.startsWith('0x')) {
    return (
      ('contract' in asset &&
        asset.contract?.toLowerCase() === ticker.toLowerCase()) ||
      false
    )
  } else {
    return asset.symbol?.toLowerCase() === ticker.toLowerCase()
  }
}

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

  const { data } = useQuery<AssetsResponse>({
    queryKey: ['assets', address],
    queryFn: async () => {
      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/assets.all`,
      )
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address,
            networks: NETWORKS,
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
        throw new Error('Failed to fetch assets.')
      }

      const body = await response.json()
      return body.result.data.json
    },
    enabled: !!address,
    staleTime: 15 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const asset = data?.assets?.find((a: AssetData) => matchesAsset(a, ticker))

  const { data: tokenDetail, isLoading: isTokenLoading } = useQuery<TokenData>({
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
        throw new Error('Failed to fetch token detail.')
      }

      const body = await response.json()
      return body.result.data.json
    },
    enabled: !!asset,
    staleTime: 15 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })

  const isLoading = !data?.assets || isTokenLoading || !tokenDetail

  const needsEthBalance = tokenDetail?.summary.symbol !== 'ETH'

  const ethBalanceQuery = useEthBalance(address, needsEthBalance)

  const ethBalance = needsEthBalance
    ? ethBalanceQuery.data?.summary.total_balance || 0
    : tokenDetail.summary.total_balance

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
      if (tokenDetail?.assets) {
        const tokenAssets = Object.values(tokenDetail.assets)
        if (tokenAssets.length > 0 && tokenAssets[0]) {
          const metadata = tokenAssets[0].metadata
          const content = await renderMarkdown(
            metadata?.about || 'No description available.',
          )
          setMarkdownContent(content)
        }
      }
    }
    processMarkdown()
  }, [tokenDetail])

  if (isLoading || !asset) {
    return <p>Loading</p>
  }

  const tokenAssets = tokenDetail?.assets
    ? Object.values(tokenDetail.assets)
    : []
  const metadata = tokenAssets[0]?.metadata || {}

  const summary = {
    symbol: asset.symbol,
    name: asset.name,
    icon: asset.icon,
    total_balance: asset.balance,
    total_eur: asset.total_eur,
    total_eur_24h_change:
      asset.total_eur * (asset.price_percentage_24h_change / 100),
    total_percentage_24h_change: asset.price_percentage_24h_change,
  }

  const uppercasedTicker = asset.symbol || ticker
  const icon = asset.icon || ''
  const name = asset.name || ticker

  const sendAsset = {
    name: tokenDetail.summary.name,
    icon,
    totalBalance: tokenDetail.summary.total_balance,
    totalBalanceEur: tokenDetail.summary.total_eur,
    contractAddress: ticker.startsWith('0x') ? ticker : undefined,
    symbol: tokenDetail.summary.symbol,
    ethBalance,
    network: (Object.keys(tokenDetail.assets)[0] ?? 'ethereum') as NetworkType,
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
          name={name}
          ticker={uppercasedTicker}
          icon={icon}
        />
      }
      rightSlot={
        <div className="flex items-center gap-1 pt-px">
          <BuyCryptoDrawer account={account} onOpenTab={handleOpenTab}>
            <Button size="32" iconBefore={<BuyIcon />}>
              <span className="block max-w-20 truncate">Buy {name}</span>
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
            asset={sendAsset}
            account={{
              ...account,
              ethBalance: sendAsset.ethBalance,
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
          <TokenLogo name={name} ticker={uppercasedTicker} icon={icon} />
          <div className="my-6 2xl:mt-0">
            <Balance variant="token" summary={summary} />
          </div>

          <div className="flex items-center gap-1">
            <BuyCryptoDrawer account={account} onOpenTab={handleOpenTab}>
              <Button size="32" iconBefore={<BuyIcon />} variant="primary">
                Buy {name}
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
              asset={sendAsset}
              account={{
                ...account,
                ethBalance: sendAsset.ethBalance,
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
            symbol={uppercasedTicker}
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
