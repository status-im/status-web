import { useEffect, useRef, useState } from 'react'

import {
  Button,
  SegmentedControl,
  Tooltip,
  useToast,
} from '@status-im/components'
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
  TokenSkeleton,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
import { useCopyToClipboard } from '@status-im/wallet/hooks'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { cx } from 'class-variance-authority'
import { Interface, parseUnits } from 'ethers'

import { useEthBalance } from '@/hooks/use-eth-balance'
import { renderMarkdown } from '@/lib/markdown'
import { apiClient } from '@/providers/api-client'
import { usePendingTransactions } from '@/providers/pending-transactions-context'
import { useWallet } from '@/providers/wallet-context'

import { AssetChart } from './asset-chart'

import type { ApiOutput, NetworkType } from '@status-im/wallet/data'

type TokenData =
  | ApiOutput['assets']['token']
  | ApiOutput['assets']['nativeToken']
type AssetsResponse = ApiOutput['assets']['all']
type AssetData = ApiOutput['assets']['all']['assets'][number]
type TokenMetadata = NonNullable<
  NonNullable<TokenData['assets']>[NetworkType]
>['metadata']

type GasFees = {
  feeEth: number
  feeEur: number
  maxFeeEth: number
  maxFeeEur: number
  confirmationTime: string
  txParams: {
    gasLimit: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }
}

type Props = {
  address: string
  ticker: string
}

const NETWORKS = ['ethereum'] as const

// Query cache time constants
const TOKEN_DETAIL_STALE_TIME = 15 * 1000 // 15 seconds
const TOKEN_DETAIL_GC_TIME = 60 * 60 * 1000 // 1 hour
const OPTIMIZED_TOKEN_STALE_TIME = 5 * 1000 // 5 seconds
const OPTIMIZED_TOKEN_REFETCH_INTERVAL = 30 * 1000 // 30 seconds

const erc20 = new Interface(['function transfer(address to, uint256 amount)'])

// Helper function to build tRPC API URL with query parameters
function buildTrpcUrl(endpoint: string, params: Record<string, unknown>): URL {
  const url = new URL(
    `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/${endpoint}`,
  )
  url.searchParams.set(
    'input',
    JSON.stringify({
      json: params,
    }),
  )
  return url
}

// Helper function to fetch data from tRPC API
async function fetchTrpcData<T>(
  endpoint: string,
  params: Record<string, unknown>,
  errorMessage: string,
): Promise<T> {
  const url = buildTrpcUrl(endpoint, params)
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(errorMessage)
  }

  const body = await response.json()
  return body.result.data.json
}

// Helper function to get token endpoint based on ticker
function getTokenEndpoint(
  ticker: string,
): 'assets.token' | 'assets.nativeToken' {
  return ticker.startsWith('0x') ? 'assets.token' : 'assets.nativeToken'
}

// Helper function to build token query parameters
function buildTokenQueryParams(
  ticker: string,
  address: string,
  options?: {
    skipMetadata?: boolean
    previousMetadata?: TokenMetadata
  },
): Record<string, unknown> {
  const baseParams: Record<string, unknown> = {
    address,
    networks: NETWORKS,
    ...(ticker.startsWith('0x') ? { contract: ticker } : { symbol: ticker }),
  }

  if (options?.skipMetadata) {
    baseParams.skipMetadata = true
  }

  if (options?.previousMetadata) {
    baseParams.previousMetadata = options.previousMetadata
  }

  return baseParams
}

// Helper function to build gas fee estimation parameters
function buildGasFeeParams(
  isNative: boolean,
  from: string,
  to: string,
  value: string,
  contractAddress?: string,
): Record<string, unknown> {
  if (isNative) {
    return {
      from,
      to,
      value,
    }
  }

  if (!contractAddress) {
    throw new Error('Contract address not found')
  }

  const amount = BigInt(value)
  const data = erc20.encodeFunctionData('transfer', [to, amount])

  return {
    from,
    to: contractAddress,
    value: '0x0',
    data,
  }
}

// Helper function to fetch gas fees
async function fetchGasFees(
  from: string,
  to: string,
  value: string,
  isNative: boolean,
  contractAddress?: string,
): Promise<GasFees> {
  const params = buildGasFeeParams(isNative, from, to, value, contractAddress)

  return fetchTrpcData<GasFees>(
    'nodes.getFeeRate',
    {
      network: 'ethereum',
      params,
    },
    'Failed to fetch gas fees',
  )
}

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

function matchesTokenSummary(
  summary: TokenData['summary'],
  ticker: string,
): boolean {
  if (ticker.startsWith('0x')) {
    return summary.contracts?.ethereum?.toLowerCase() === ticker.toLowerCase()
  } else {
    return summary.symbol?.toUpperCase() === ticker.toUpperCase()
  }
}

function getTokenMetadata(
  tokenDetail: TokenData | undefined,
  shouldUse: boolean,
): TokenMetadata | undefined {
  if (!tokenDetail?.assets || !shouldUse) {
    return undefined
  }
  return Object.values(tokenDetail.assets)[0]?.metadata
}

const Token = (props: Props) => {
  const { ticker, address } = props

  const [, copy] = useCopyToClipboard()
  const toast = useToast()
  const { currentWallet } = useWallet()
  const { addPendingTransaction } = usePendingTransactions()

  const [activeDataType, setActiveDataType] =
    useState<ChartDataType>(DEFAULT_DATA_TYPE)

  const [activeTimeFrame, setActiveTimeFrame] =
    useState<ChartTimeFrame>(DEFAULT_TIME_FRAME)

  const [gasInput, setGasInput] = useState<{
    to: string
    value: string
  } | null>(null)

  const [markdownContent, setMarkdownContent] = useState<React.ReactNode>(null)

  const gasEstimateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setActiveDataType(DEFAULT_DATA_TYPE)
    setActiveTimeFrame(DEFAULT_TIME_FRAME)
  }, [ticker])

  const { data, isError: hasErrorFetchingAssets } = useQuery<AssetsResponse>({
    queryKey: ['assets', address],
    queryFn: () =>
      fetchTrpcData<AssetsResponse>(
        'assets.all',
        { address, networks: NETWORKS },
        'Failed to fetch assets.',
      ),
    enabled: !!address,
    staleTime: TOKEN_DETAIL_STALE_TIME,
    gcTime: TOKEN_DETAIL_GC_TIME,
  })

  // Show error toast if fetching assets fails
  useEffect(() => {
    if (hasErrorFetchingAssets) {
      toast.negative(ERROR_MESSAGES.ASSETS_FETCH)
    }
  }, [hasErrorFetchingAssets, toast])

  const asset = data?.assets?.find((a: AssetData) => matchesAsset(a, ticker))

  const {
    data: tokenDetail,
    isLoading: isTokenLoading,
    isError: hasErrorFetchingToken,
  } = useQuery<TokenData>({
    queryKey: ['token', ticker, address],
    queryFn: () =>
      fetchTrpcData<TokenData>(
        getTokenEndpoint(ticker),
        buildTokenQueryParams(ticker, address),
        'Failed to fetch token detail.',
      ),
    enabled: !!asset,
    staleTime: TOKEN_DETAIL_STALE_TIME,
    gcTime: TOKEN_DETAIL_GC_TIME,
    placeholderData: previousData => previousData,
  })

  // Check if tokenDetail is for the current token and fully loaded
  const isTokenDetailForCurrentToken =
    tokenDetail?.summary &&
    !isTokenLoading &&
    matchesTokenSummary(tokenDetail.summary, ticker)

  // Optimized query for price and balance updates only
  const { data: optimizedTokenDetail } = useQuery<TokenData>({
    queryKey: ['token-optimized', ticker, address],
    queryFn: () => {
      const previousMetadata = getTokenMetadata(
        tokenDetail,
        !!isTokenDetailForCurrentToken,
      )

      return fetchTrpcData<TokenData>(
        getTokenEndpoint(ticker),
        buildTokenQueryParams(ticker, address, {
          skipMetadata: true,
          previousMetadata,
        }),
        'Failed to fetch token detail.',
      )
    },
    enabled: !!tokenDetail && !!asset && isTokenDetailForCurrentToken,
    staleTime: OPTIMIZED_TOKEN_STALE_TIME,
    gcTime: TOKEN_DETAIL_GC_TIME,
    refetchInterval: OPTIMIZED_TOKEN_REFETCH_INTERVAL,
    placeholderData: tokenDetail,
  })

  // Show error toast if fetching token detail fails
  useEffect(() => {
    if (hasErrorFetchingToken) {
      toast.negative(ERROR_MESSAGES.TOKEN_INFO)
    }
  }, [hasErrorFetchingToken, toast])

  const isOptimizedForCurrentToken =
    optimizedTokenDetail?.summary &&
    matchesTokenSummary(optimizedTokenDetail.summary, ticker)

  const shouldUseOptimizedData =
    optimizedTokenDetail &&
    isOptimizedForCurrentToken &&
    isTokenDetailForCurrentToken

  const finalTokenDetail = shouldUseOptimizedData
    ? optimizedTokenDetail
    : tokenDetail

  const isLoading =
    !data?.assets || (isTokenLoading && !tokenDetail) || !finalTokenDetail

  const needsEthBalance = finalTokenDetail?.summary.symbol !== 'ETH'

  const ethBalanceQuery = useEthBalance(address, needsEthBalance)

  const ethBalance = needsEthBalance
    ? ethBalanceQuery.data?.summary.total_balance || 0
    : finalTokenDetail?.summary.total_balance || 0

  // Get gas fees for the current network
  const gasFeeQuery = useQuery<GasFees>({
    queryKey: ['gas-fees', address, gasInput?.to, gasInput?.value],
    queryFn: async ({ queryKey }) => {
      const [, from, to, value] = queryKey as [string, string, string, string]
      const isNative = finalTokenDetail?.summary.symbol === 'ETH'
      const contractAddress = finalTokenDetail?.summary.contracts.ethereum

      return fetchGasFees(from, to, value, isNative, contractAddress)
    },
    enabled:
      !!gasInput?.to && !!gasInput?.value && !!address && !!finalTokenDetail,
  })

  // Show error toast if fetching gas fees fails
  useEffect(() => {
    if (gasFeeQuery.isError) {
      toast.negative(ERROR_MESSAGES.GAS_FEES_FETCH)
    }
  }, [gasFeeQuery.isError, toast])

  useEffect(() => {
    return () => {
      if (gasEstimateTimeoutRef.current) {
        clearTimeout(gasEstimateTimeoutRef.current)
      }
    }
  }, [])

  const prepareGasEstimate = (to: string, value: string) => {
    if (gasEstimateTimeoutRef.current) {
      clearTimeout(gasEstimateTimeoutRef.current)
    }

    gasEstimateTimeoutRef.current = setTimeout(() => {
      setGasInput({ to, value })
    }, 500)
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
      if (finalTokenDetail?.assets) {
        const tokenAssets = Object.values(finalTokenDetail.assets)
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
  }, [finalTokenDetail])

  if (isLoading || !asset) {
    return <TokenSkeleton />
  }

  const tokenAssets = finalTokenDetail?.assets
    ? Object.values(finalTokenDetail.assets)
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
    name: finalTokenDetail.summary.name,
    icon,
    totalBalance: finalTokenDetail.summary.total_balance,
    totalBalanceEur: finalTokenDetail.summary.total_eur,
    contractAddress: ticker.startsWith('0x') ? ticker : undefined,
    symbol: finalTokenDetail.summary.symbol,
    ethBalance,
    network: (Object.keys(finalTokenDetail.assets)[0] ??
      'ethereum') as NetworkType,
    decimals: asset.decimals ?? 18,
  }

  // Mock wallet data. Replace with actual wallet data from the user's account.
  const account: Account = {
    address,
    name: currentWallet?.name || 'Account 1',
    emoji: '🍑',
    color: 'magenta',
  }

  const signTransaction = async (
    formData: SendAssetsFormData & { password: string },
  ) => {
    if (!gasFeeQuery.data) {
      throw new Error('Gas fees not available')
    }

    const isNative = finalTokenDetail?.summary.symbol === 'ETH'

    if (isNative) {
      const amountHex = parseUnits(formData.amount, 18).toString(16)
      const params = {
        amount: amountHex,
        toAddress: formData.to,
        fromAddress: address,
        password: formData.password,
        walletId: currentWallet?.id || '',
        gasLimit: gasFeeQuery.data.txParams.gasLimit,
        maxFeePerGas: gasFeeQuery.data.txParams.maxFeePerGas,
        maxInclusionFeePerGas: gasFeeQuery.data.txParams.maxPriorityFeePerGas,
      }

      const result = await apiClient.wallet.account.ethereum.send.mutate(params)
      if (!result.id || result.id.txid?.error) {
        console.error(result.id.txid?.error)
        toast.negative(ERROR_MESSAGES.TX_FAILED)
        throw new Error('Transaction failed')
      }

      const txHash = typeof result.id === 'string' ? result.id : result.id.txid

      if (!txHash) {
        toast.negative(ERROR_MESSAGES.TX_FAILED)
        throw new Error('Transaction hash not found')
      }

      addPendingTransaction({
        hash: txHash,
        from: address,
        to: formData.to,
        value: parseFloat(formData.amount),
        asset: finalTokenDetail.summary.symbol,
        network: 'ethereum',
        status: 'pending',
        category: 'external',
        blockNum: '0',
        metadata: {
          blockTimestamp: new Date().toISOString(),
        },
        rawContract: {
          value: amountHex,
          address: ticker.startsWith('0x') ? ticker : null,
          decimal: '18',
        },
        eurRate: 0,
      })
    } else {
      const tokenDecimals = asset.decimals ?? 18
      const amount = parseUnits(formData.amount, tokenDecimals)
      const amountHex = amount.toString(16)
      const contractAddress = finalTokenDetail?.summary.contracts.ethereum

      if (!contractAddress) {
        throw new Error('Token contract address not found')
      }

      const data = erc20.encodeFunctionData('transfer', [formData.to, amount])

      const params = {
        amount: '0',
        toAddress: contractAddress,
        fromAddress: address,
        password: formData.password,
        walletId: currentWallet?.id || '',
        gasLimit: gasFeeQuery.data.txParams.gasLimit,
        maxFeePerGas: gasFeeQuery.data.txParams.maxFeePerGas,
        maxInclusionFeePerGas: gasFeeQuery.data.txParams.maxPriorityFeePerGas,
        data,
      }

      const result =
        await apiClient.wallet.account.ethereum.sendErc20.mutate(params)

      if (!result.id || result.id.txid?.error) {
        console.error(result.id.txid?.error)
        toast.negative(ERROR_MESSAGES.TX_FAILED)
        throw new Error('Transaction failed')
      }

      const txHash = typeof result.id === 'string' ? result.id : result.id.txid

      if (!txHash) {
        toast.negative(ERROR_MESSAGES.TX_FAILED)
        throw new Error('Transaction hash not found')
      }

      addPendingTransaction({
        hash: txHash,
        from: address,
        to: formData.to,
        value: parseFloat(formData.amount),
        asset: finalTokenDetail.summary.symbol,
        network: 'ethereum',
        status: 'pending',
        category: 'external',
        blockNum: '0',
        metadata: {
          blockTimestamp: new Date().toISOString(),
        },
        rawContract: {
          value: amountHex,
          address: ticker.startsWith('0x') ? ticker : null,
          decimal: asset.decimals?.toString() ?? '18',
        },
        eurRate: 0,
      })
      return result.id.txid
    }
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
          <BuyCryptoDrawer
            account={account}
            onOpenTab={handleOpenTab}
            symbol={finalTokenDetail.summary.symbol}
          >
            <Button size="32" iconBefore={<BuyIcon />}>
              <span className="block max-w-20 truncate">Buy</span>
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
            <Button size="32" iconBefore={<SendBlurIcon />} variant="outline">
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
            <BuyCryptoDrawer
              account={account}
              onOpenTab={handleOpenTab}
              symbol={finalTokenDetail.summary.symbol}
            >
              <Button size="32" iconBefore={<BuyIcon />} variant="primary">
                Buy
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
                size="32"
              >
                <SegmentedControl.Item value="price">
                  Price
                </SegmentedControl.Item>
                <SegmentedControl.Item value="balance">
                  Balance
                </SegmentedControl.Item>
                {/* <SegmentedControl.Item value="value">
                  Value
                </SegmentedControl.Item> */}
              </SegmentedControl.Root>
            </div>
            <div className="inline-flex">
              <SegmentedControl.Root
                value={activeTimeFrame}
                onValueChange={value =>
                  setActiveTimeFrame(value as ChartTimeFrame)
                }
                size="32"
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
                    value={metadata.fully_diluted}
                    format="compact"
                  />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.fully_diluted}
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
                    format="precise"
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
                    format="precise"
                  />
                ),
              },
              {
                label: '24h Volume',
                value: (
                  <CurrencyAmount value={metadata.volume_24} format="compact" />
                ),
                tooltip: (
                  <CurrencyAmount
                    value={metadata.volume_24}
                    format="standard"
                  />
                ),
              },
              {
                label: 'Rank by Mcap',
                value: metadata?.rank_by_market_cap ?? 'N/A',
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
                <OptionalTooltip content={item.tooltip}>
                  <div>
                    <div className="text-13 font-regular text-neutral-50">
                      {item.label}
                    </div>
                    <div className="text-13 font-medium text-neutral-100">
                      {item.value}
                    </div>
                  </div>
                </OptionalTooltip>
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

const OptionalTooltip = ({
  content,
  children,
}: {
  content?: React.ReactNode
  children: React.ReactElement
}) => {
  if (!content) {
    return children
  }
  return (
    <Tooltip content={content} side="top">
      {children}
    </Tooltip>
  )
}

export { Token }
