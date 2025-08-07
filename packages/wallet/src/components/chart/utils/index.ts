import { differenceInCalendarMonths } from 'date-fns'

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
    previousDate,
    firstDate,
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

  const isFirstDataPoint = index === 0

  if (variant === '24H') {
    const hourInterval = getSafeInterval(60)
    if (index % hourInterval === 0) {
      return 'hour'
    }
    return 'empty'
  }

  if (variant === '7D') {
    const currentDay = date.getDate()
    const previousDay = previousDate ? previousDate.getDate() : -1
    const isDayTransition = currentDay !== previousDay

    if (isFirstDataPoint || isDayTransition) {
      return 'month'
    }
    return 'empty'
  }

  if (variant === '1M') {
    const interval = getSafeInterval(40)

    if (index % interval === 0) {
      const currentDayOfMonth = date.getDate()
      if (isFirstDataPoint || currentDayOfMonth === 1) {
        return 'month'
      }
      return 'day'
    }

    return 'empty'
  }

  if (variant === '3M') {
    const currentMonth = date.getMonth()
    const previousMonth = previousDate ? previousDate.getMonth() : -1
    const isMonthTransition = currentMonth !== previousMonth

    if (isFirstDataPoint || isMonthTransition) {
      return 'month'
    }

    const dayInterval = Math.max(10, getSafeInterval(60))
    if (index % dayInterval === 0) {
      return 'day'
    }

    return 'empty'
  }

  if (variant === '1Y') {
    const currentMonth = date.getMonth()
    const previousMonth = previousDate ? previousDate.getMonth() : -1
    const isMonthTransition = currentMonth !== previousMonth

    if (isFirstDataPoint || isMonthTransition) {
      return 'month'
    }

    return 'empty'
  }

  if (variant === 'All') {
    if (isFirstDataPoint) {
      return 'month'
    }

    const currentYear = date.getFullYear()
    const previousYear = previousDate ? previousDate.getFullYear() : -1
    const isYearTransition = currentYear !== previousYear

    if (isYearTransition) {
      return 'month'
    }

    const monthInterval = Math.max(6, getSafeInterval(60))
    const monthsFromReference = differenceInCalendarMonths(date, firstDate)

    return monthsFromReference % monthInterval === 0 ? 'month' : 'empty'
  }

  return 'bullet'
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'standard',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const preciseTokenFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  notation: 'standard',
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 4,
})

export const formatChartValue = (value: number, dataType: DataType): string => {
  switch (dataType) {
    case 'balance':
      return preciseTokenFormatter.format(value)

    case 'price':
    case 'value':
      return currencyFormatter.format(value)

    default:
      return currencyFormatter.format(value)
  }
}

const smallCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'standard',
  minimumSignificantDigits: 4,
  maximumSignificantDigits: 4,
  roundingPriority: 'morePrecision',
})

const smallNumberFormatter = new Intl.NumberFormat('en-US', {
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

  const formatter =
    dataType === 'balance' ? smallNumberFormatter : smallCurrencyFormatter
  return formatter.format(value)
}

export const getChartValue = (
  point: ChartDataPoint,
  dataType: DataType,
): number => {
  switch (dataType) {
    case 'price':
      return point.price
    case 'balance':
      return point.balance ?? point.price
    case 'value':
      return point.value ?? point.price
  }
}

export const createChartDataPoint = (
  date: string,
  value: number,
  dataType: DataType,
  additionalData?: { price?: number; balance?: number },
): ChartDataPoint => {
  switch (dataType) {
    case 'price':
      return { date, price: value }
    case 'balance':
      return { date, price: value, balance: value }
    case 'value':
      return {
        date,
        price: additionalData?.price ?? 0,
        balance: additionalData?.balance ?? 0,
        value,
      }
  }
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

    if (dataType === 'balance') {
      return tickValue < 1
        ? smallNumberFormatter.format(tickValue)
        : preciseTokenFormatter.format(tickValue)
    } else {
      return tickValue < 1
        ? smallCurrencyFormatter.format(tickValue)
        : currencyFormatter.format(tickValue)
    }
  })

  return { min: finalMin, max: finalMax, ticks }
}
