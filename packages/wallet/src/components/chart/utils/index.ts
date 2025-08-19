export const TIME_FRAMES = ['24H', '7D', '1M', '3M', '1Y', 'All'] as const
export type TimeFrame = (typeof TIME_FRAMES)[number]

export type DataType = 'price' | 'balance'
export type ChartDataPoint = { date: string; price: number }
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

export const formatChartValue = (
  value: number,
  dataType: 'price' | 'balance',
  currency?: string,
): string => {
  const fractionalDigits = value.toString().split('.')[1]?.length || 0

  if (dataType === 'balance') {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: fractionalDigits,
      maximumFractionDigits: fractionalDigits,
    })
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: fractionalDigits,
    maximumFractionDigits: fractionalDigits,
  })
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'standard',
  minimumSignificantDigits: 4,
  maximumSignificantDigits: 4,
  roundingPriority: 'morePrecision',
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  notation: 'standard',
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  minimumSignificantDigits: 4,
  maximumSignificantDigits: 4,
  roundingPriority: 'morePrecision',
})

export const formatSmallNumber = (
  value: number,
  dataType: DataType = 'price',
): string => {
  if (value === 0) return '0'

  // Use the same decimal precision logic as Y-axis ticks
  const formatter = dataType === 'balance' ? numberFormatter : currencyFormatter
  return formatter.format(value)
}

export const calculateChartRange = (
  data: Array<{ price: number }>,
  marginFactor = 0.1,
  dataType: DataType = 'price',
) => {
  if (data.length === 0) return { min: 0, max: 1, ticks: [] }

  const prices = data.map(d => d.price)
  const maxPrice = Math.max(...prices)
  const minPrice = Math.min(...prices)
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
    const formatter =
      dataType === 'balance' ? numberFormatter : currencyFormatter
    return formatter.format(tickValue)
  })

  return { min: finalMin, max: finalMax, ticks }
}
