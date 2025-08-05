import { useMemo } from 'react'

import type { ApiOutput } from '@status-im/wallet/data'

type UseValueChartDataParams = {
  activeDataType: string
  priceData: ApiOutput['assets']['tokenPriceChart'] | null | undefined
  balanceData: ApiOutput['assets']['tokenBalanceChart'] | null | undefined
}

export function useValueChartData({
  activeDataType,
  priceData,
  balanceData,
}: UseValueChartDataParams) {
  return useMemo(() => {
    if (
      activeDataType !== 'value' ||
      !priceData ||
      !balanceData ||
      balanceData.length === 0
    ) {
      return []
    }

    const balancePoints = balanceData
      .map(point => [new Date(point.date).getTime(), point.price] as const)
      .sort((a, b) => a[0] - b[0])

    const findBalance = (targetTime: number): number => {
      let left = 0
      let right = balancePoints.length - 1
      let bestBalance = 0

      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        const [pointTime, balance] = balancePoints[mid]

        if (pointTime <= targetTime) {
          bestBalance = balance
          left = mid + 1
        } else {
          right = mid - 1
        }
      }

      return bestBalance
    }

    return priceData.map(pricePoint => {
      const targetTime = new Date(pricePoint.date).getTime()
      const balance = findBalance(targetTime)

      return {
        date: pricePoint.date,
        price: balance * pricePoint.price,
      }
    })
  }, [activeDataType, priceData, balanceData])
}
