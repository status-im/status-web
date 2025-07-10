import { useEffect, useMemo, useState } from 'react'

import { Button, Tooltip } from '@status-im/components'
import {
  ArrowLeftIcon,
  BuyIcon,
  ReceiveBlurIcon,
  SendBlurIcon,
} from '@status-im/icons/20'
import {
  Balance,
  CurrencyAmount,
  NetworkBreakdown,
  ReceiveCryptoDrawer,
  SendAssetsModal,
  StickyHeaderContainer,
  TokenAmount,
  TokenLogo,
} from '@status-im/wallet/components'
import { type ApiOutput, type NetworkType } from '@status-im/wallet/data'
import { useCopyToClipboard } from '@status-im/wallet/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { cx } from 'class-variance-authority'

import { useEthBalance } from '@/hooks/use-eth-balance'
import { renderMarkdown } from '@/lib/markdown'
import { apiClient } from '@/providers/api-client'
import { useWallet } from '@/providers/wallet-context'

import type { Account, SendAssetsFormData } from '@status-im/wallet/components'

type TokenData =
  | ApiOutput['assets']['token']
  | ApiOutput['assets']['nativeToken']
type AssetsData = ApiOutput['assets']['all']['assets']
type AssetData = ApiOutput['assets']['all']['assets'][number]

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

  const { currentWallet } = useWallet()
  const [gasInput, setGasInput] = useState<{
    to: string
    value: string
  } | null>(null)

  const queryClient = useQueryClient()

  const cachedAssetLookup = useMemo(() => {
    const assetsCache = queryClient.getQueryData<AssetsData>([
      'assets',
      address,
    ])

    if (!assetsCache || !Array.isArray(assetsCache)) return null

    return assetsCache.find(asset => matchesAsset(asset, ticker))
  }, [queryClient, address, ticker])

  const token = useQuery<TokenData>({
    queryKey: ['token', ticker],
    queryFn: async () => {
      const assetsCache = queryClient.getQueryData<AssetsData>([
        'assets',
        address,
      ])

      if (assetsCache && Array.isArray(assetsCache)) {
        const cachedAsset = cachedAssetLookup

        if (cachedAsset) {
          const existingTokenData = queryClient.getQueryData<TokenData>([
            'token',
            ticker,
          ])

          if (
            existingTokenData &&
            existingTokenData.summary &&
            existingTokenData.assets
          ) {
            const updatedTokenData = {
              ...existingTokenData,
              summary: {
                ...existingTokenData.summary,
                total_balance:
                  cachedAsset.balance ??
                  existingTokenData.summary.total_balance,
                total_eur:
                  cachedAsset.total_eur ?? existingTokenData.summary.total_eur,
              },
            }

            if (existingTokenData.assets) {
              const assetKeys = Object.keys(existingTokenData.assets)
              for (const key of assetKeys) {
                const asset =
                  existingTokenData.assets[
                    key as keyof typeof existingTokenData.assets
                  ]
                if (
                  asset &&
                  (asset.symbol === cachedAsset.symbol ||
                    asset.contract === cachedAsset.contract)
                ) {
                  updatedTokenData.assets = {
                    ...existingTokenData.assets,
                    [key]: {
                      ...asset,
                      balance: cachedAsset.balance ?? asset.balance,
                      total_eur: cachedAsset.total_eur ?? asset.total_eur,
                      price_eur: cachedAsset.price_eur ?? asset.price_eur,
                      price_percentage_24h_change:
                        cachedAsset.price_percentage_24h_change ??
                        asset.price_percentage_24h_change,
                    },
                  }
                  break
                }
              }
            }

            queryClient.setQueryData(['token', ticker], updatedTokenData)
            return updatedTokenData
          }
        }
      }

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
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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

  useEffect(() => {
    const processMarkdown = async () => {
      if (typedToken && typedToken.assets) {
        const assets = Object.values(typedToken.assets)
        if (assets.length > 0 && assets[0]) {
          const metadata = assets[0].metadata
          const content = await renderMarkdown(
            metadata?.about || 'No description available.',
          )
          setMarkdownContent(content)
        }
      }
    }
    processMarkdown()
  }, [typedToken])

  if (isLoading || !typedToken || !typedToken.assets) {
    return <p>Loading</p>
  }

  const assets = Object.values(typedToken.assets)
  if (!assets || assets.length === 0 || !assets[0]) {
    return <p>No asset data available</p>
  }

  const metadata = assets[0].metadata || {}
  const summary = typedToken.summary || {}
  const uppercasedTicker = summary.symbol || ticker
  const icon = summary.icon || ''
  const name = summary.name || ticker

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
          name={name}
          ticker={uppercasedTicker}
          icon={icon}
        />
      }
      rightSlot={
        <div className="flex items-center gap-1 pt-px">
          <Button size="32" iconBefore={<BuyIcon />}>
            <span className="block max-w-20 truncate">Buy {name}</span>
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
          <TokenLogo name={name} ticker={uppercasedTicker} icon={icon} />
          <div className="my-6 2xl:mt-0">
            <Balance variant="token" summary={summary} />
          </div>

          <div className="flex items-center gap-1">
            <Button size="32" iconBefore={<BuyIcon />} variant="primary">
              Buy {name}
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

        {summary.total_balance > 0 && <NetworkBreakdown token={typedToken} />}

        {/* <ErrorBoundary fallback={<div>Error loading chart</div>}>
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
        </ErrorBoundary> */}

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
