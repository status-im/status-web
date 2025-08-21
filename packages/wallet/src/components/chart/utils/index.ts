import { match } from 'ts-pattern'

export const TIME_FRAMES = ['24H', '7D', '1M', '3M', '1Y', 'All'] as const
export type TimeFrame = (typeof TIME_FRAMES)[number]

export type DataType = 'price' | 'balance' | 'value'
export type ChartDataPoint = {
  date: string
  price: number
  balance?: number
  value?: number
}
export type ChartDatum = { date: Date; value: number }

export const DEFAULT_TIME_FRAME: TimeFrame = TIME_FRAMES[0]
export const DEFAULT_DATA_TYPE: DataType = 'price'

export type BaseChartProps = {
  dataType?: DataType
  currency?: string
  isPositive?: boolean
}

type CheckDateOutputProps = {
  date: Date
  previousDate?: Date | null
  firstDate: Date
  index: number
  variant: TimeFrame
  totalDataPoints?: number
  availableWidth?: number
}

export const checkDateOutput = (
  props: CheckDateOutputProps,
): 'bullet' | 'month' | 'day' | 'hour' | 'empty' => {
  const {
    date,
    index,
    variant,
    totalDataPoints = 0,
    availableWidth = 300,
  } = props

  const getMaxLabels = (minWidth: number): number => {
    return Math.floor(availableWidth / minWidth)
  }

  const getSafeInterval = (minWidth: number): number => {
    const maxLabels = getMaxLabels(minWidth)
    if (maxLabels <= 0) return totalDataPoints
    return Math.max(1, Math.ceil(totalDataPoints / maxLabels))
  }

  if (variant === '24H') {
    const hourInterval = getSafeInterval(60)
    if (index % hourInterval === 0) {
      return 'hour'
    }
    return 'empty'
  }

  if (variant === '7D') {
    const dayInterval = getSafeInterval(70)

    if (index % dayInterval === 0) {
      return 'month'
    }
    return 'empty'
  }

  if (variant === '1M') {
    const interval = getSafeInterval(60)

    if (index % interval === 0) {
      const currentDayOfMonth = date.getDate()
      if (currentDayOfMonth === 1) {
        return 'month'
      }
      return 'day'
    }

    return 'empty'
  }

  if (variant === '3M') {
    const dayInterval = Math.max(10, getSafeInterval(60))
    if (index % dayInterval === 0) {
      return 'day'
    }

    return 'empty'
  }

  if (variant === '1Y') {
    const monthInterval = getSafeInterval(50)

    if (index > 0 && index % monthInterval === 0) {
      return 'month'
    }

    return 'empty'
  }

  if (variant === 'All') {
    const yearInterval = getSafeInterval(50)

    if (index > 0 && index % yearInterval === 0) {
      return 'month'
    }

    return 'empty'
  }

  return 'bullet'
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  notation: 'standard',
  currency: 'USD',
  minimumSignificantDigits: 4,
  maximumSignificantDigits: 4,
  roundingPriority: 'morePrecision',
})

const balanceFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  notation: 'standard',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 4,
  roundingPriority: 'morePrecision',
})

const valueFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'standard',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatChartValue = (value: number, dataType: DataType): string => {
  return match(dataType)
    .with('balance', () => balanceFormatter.format(value))
    .with('price', () => priceFormatter.format(value))
    .with('value', () => valueFormatter.format(value))
    .exhaustive()
}

export const getChartValue = (
  point: ChartDataPoint,
  dataType: DataType,
): number => {
  return match(dataType)
    .with('price', () => point.price)
    .with('balance', () => point.balance ?? point.price)
    .with('value', () => point.value ?? point.price)
    .exhaustive()
}

export const createChartDataPoint = (
  date: string,
  value: number,
  dataType: DataType,
  additionalData?: { price?: number; balance?: number },
): ChartDataPoint => {
  return match(dataType)
    .with('price', () => ({ date, price: value }))
    .with('balance', () => ({ date, price: value, balance: value }))
    .with('value', () => ({
      date,
      price: additionalData?.price ?? 0,
      balance: additionalData?.balance ?? 0,
      value,
    }))
    .exhaustive()
}

export const calculateChartRange = (
  data: ChartDataPoint[],
  marginFactor = 0.1,
  dataType: DataType = 'price',
) => {
  if (data.length === 0) return { min: 0, max: 1, ticks: [] }

  const values = data.map(d => getChartValue(d, dataType))
  const maxPrice = Math.max(...values)
  const minPrice = Math.min(...values)
  const priceRange = maxPrice - minPrice

  const adjustedMin = minPrice - priceRange * marginFactor
  const adjustedMax = maxPrice + priceRange * marginFactor

  const finalMin = Math.max(0, adjustedMin)
  const finalMax = adjustedMax

  // Generate ticks
  const tickCount = 7
  const tickInterval = (finalMax - finalMin) / (tickCount - 1)

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tickValue = finalMin + i * tickInterval

    return formatChartValue(tickValue, dataType)
  })

  return { min: finalMin, max: finalMax, ticks }
}
