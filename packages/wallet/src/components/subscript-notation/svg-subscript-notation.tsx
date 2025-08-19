import { type DataType, getSubscriptData } from './utils'

type SvgSubscriptNumberProps = {
  value: number
  dataType?: DataType
}

export const SvgSubscriptNumber = ({
  value,
  dataType = 'price',
}: SvgSubscriptNumberProps) => {
  const subscriptData = getSubscriptData(Math.abs(value))

  if (!subscriptData) {
    return null
  }

  const currencySymbol = dataType === 'price' ? '$' : ''
  const sign = value < 0 ? '-' : ''

  return (
    <>
      <tspan fontSize="12">
        {currencySymbol}
        {sign}
        {subscriptData.prefix}
      </tspan>
      <tspan fontSize="10" baselineShift="sub">
        {subscriptData.subscript}
      </tspan>
      <tspan fontSize="12">{subscriptData.suffix}</tspan>
    </>
  )
}
