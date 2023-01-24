import { memo } from 'react'

import { themed } from '@status-im/icons/src/themed'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from './types'

function Icon(props: IconProps) {
  const { color, size = 20, ...otherProps } = props

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      {...otherProps}
    >
      <Path
        d="m5.569 9.35 3.89-3.89-.919-.92-5 5-.46.46.46.46 5 5 .92-.92-3.891-3.89h10.43v-1.3H5.57Z"
        fill={`${color}`}
      />
    </Svg>
  )
}

export const ArrowIcon = memo<IconProps>(themed(Icon))
