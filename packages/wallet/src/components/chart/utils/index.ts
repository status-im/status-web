import { differenceInCalendarMonths } from 'date-fns'

export const TIME_FRAMES = ['24H', '7D', '1M', '3M', '1Y', 'All'] as const
export type TimeFrame = (typeof TIME_FRAMES)[number]

export type DataType = 'price' | 'balance' | 'value'
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

export const formatChartValue = (
  value: number,
  dataType: DataType,
  currency?: string,
): string => {
  const fractionalDigits = value.toString().split('.')[1]?.length || 0

  if (dataType === 'balance') {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: fractionalDigits,
      maximumFractionDigits: fractionalDigits,
    })
  }

  if (dataType === 'value') {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: fractionalDigits,
    maximumFractionDigits: fractionalDigits,
  })
}

export const formatSmallNumber = (value: number): string => {
  if (value === 0) return '0'

  // Use the same decimal precision logic as Y-axis ticks
  const fractionalDigits = value.toString().split('.')[1]?.length || 0
  const maxDecimals = Math.min(fractionalDigits, 4)

  if (maxDecimals === 0) return Math.round(value).toString()
  return value.toFixed(value === 0 ? 0 : maxDecimals)
}

export const calculateChartRange = (
  data: Array<{ price: number }>,
  marginFactor = 0.1,
  dataType?: DataType,
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
  const maxDecimals = Math.min(
    Math.max(
      ...data.map(d =>
        d.price % 1 !== 0 ? d.price.toString().split('.')[1]?.length || 0 : 0,
      ),
    ),
    4,
  )

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tickValue = finalMin + i * tickInterval

    // Use formatChartValue for specific data types, otherwise use generic formatting
    if (dataType) {
      return formatChartValue(tickValue, dataType, 'USD')
    }

    if (maxDecimals === 0) return Math.round(tickValue).toString()
    return tickValue.toFixed(tickValue === 0 ? 0 : maxDecimals)
  })

  return { min: finalMin, max: finalMax, ticks }
}
