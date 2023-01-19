import { memo } from 'react'

import { themed } from '@status-im/icons/src/themed'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from './types'

function Icon(props: IconProps) {
  const { color, size = 16, ...otherProps } = props

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      {...otherProps}
    >
      <Path d="M8 14L12 10L8 6" stroke={`${color}`} strokeWidth="1.3" />
    </Svg>
  )
}

export const ChevronIcon = memo<IconProps>(themed(Icon))
