export type SubscriptData = {
  prefix: string
  subscript: string
  suffix: string
}

export type DataType = 'price' | 'balance'

export const getSubscriptData = (value: number): SubscriptData | null => {
  if (value === 0 || value >= 0.0001) return null

  const str = value.toFixed(20)
  const match = str.match(/^0\.0*/)

  if (!match) return null

  const leadingZeros = match[0].length - 2
  const remainingPart = str.slice(match[0].length)

  const nonZeroMatch = remainingPart.match(/^(\d{4,})/)
  if (!nonZeroMatch) {
    const fallbackMatch = remainingPart.match(/^(\d+)/)
    if (!fallbackMatch) return null

    const digits = fallbackMatch[1]
    const significantDigits =
      digits.length >= 4 ? digits.slice(0, 4) : digits.padEnd(4, '0')

    return {
      prefix: '0.0',
      subscript: leadingZeros.toString(),
      suffix: significantDigits,
    }
  }

  const significantDigits = nonZeroMatch[1].slice(0, 4)

  return {
    prefix: '0.0',
    subscript: leadingZeros.toString(),
    suffix: significantDigits,
  }
}

export const formatSubscriptString = (
  value: number,
  dataType: DataType = 'price',
): string | null => {
  const subscriptData = getSubscriptData(Math.abs(value))
  if (!subscriptData) return null

  const formattedValue = `${subscriptData.prefix}${subscriptData.subscript}${subscriptData.suffix}`

  if (dataType === 'price') {
    return `$${value < 0 ? '-' : ''}${formattedValue}`
  }
  return `${value < 0 ? '-' : ''}${formattedValue}`
}
