import {
  Chart,
  ChartLoading,
  DEFAULT_DATA_TYPE,
  DEFAULT_TIME_FRAME,
} from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { notFound } from '@tanstack/react-router'

import type {
  ChartDataType,
  ChartTimeFrame,
} from '@status-im/wallet/components'
import type { ApiOutput } from '@status-im/wallet/data'

const getTimeFrameDays = (timeFrame: string): string => {
  switch (timeFrame) {
    case '24H':
      return '1'
    case '7D':
      return '7'
    case '1M':
      return '30'
    case '3M':
      return '90'
    case '1Y':
      return '365'
    case 'All':
      return 'all'
    default:
      return '1'
  }
}

const NETWORKS = ['ethereum'] as const

function AssetChart({
  address,
  slug,
  symbol,
  timeFrame = DEFAULT_TIME_FRAME,
  activeDataType = DEFAULT_DATA_TYPE,
}: {
  address: string
  slug: string
  symbol: string
  timeFrame?: ChartTimeFrame
  activeDataType?: ChartDataType
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
    queryKey: ['priceChart', symbol, slug, timeFrame],
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
          days: getTimeFrameDays(timeFrame),
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
    queryKey: ['balanceChart', address, slug, timeFrame],
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
          days: getTimeFrameDays(timeFrame),
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
    return <ChartLoading />
  }

  if (priceChart.error || balanceChart.error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-danger-50">Failed to load chart</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <Chart
        price={priceChart.data || []}
        balance={balanceChart.data || []}
        activeTimeFrame={timeFrame as ChartTimeFrame}
        activeDataType={activeDataType}
      />
    </div>
  )
}

export { AssetChart }
