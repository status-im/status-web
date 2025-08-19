import { SvgSubscriptNumber } from './svg-subscript-notation'
import { type DataType, formatSubscriptString, getSubscriptData } from './utils'

type SubscriptNumberProps = {
  value: number
  dataType?: DataType
  className?: string
}

const SubscriptNumber = ({
  value,
  dataType = 'price',
  className,
}: SubscriptNumberProps) => {
  const subscriptData = getSubscriptData(Math.abs(value))

  if (!subscriptData) {
    return null
  }

  const currencySymbol = dataType === 'price' ? '$' : ''
  const sign = value < 0 ? '-' : ''

  return (
    <span className={className}>
      {currencySymbol}
      {sign}
      {subscriptData.prefix}
      <sub style={{ fontSize: '0.85em', lineHeight: '1.2' }}>
        {subscriptData.subscript}
      </sub>
      {subscriptData.suffix}
    </span>
  )
}

export {
  formatSubscriptString,
  getSubscriptData,
  SubscriptNumber,
  SvgSubscriptNumber,
}
