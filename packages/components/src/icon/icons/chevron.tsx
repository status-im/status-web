import { memo } from 'react'

import { Path, Svg } from 'react-native-svg'

import { themed } from '../themed'

import type { IconProps } from '../IconProps'

const Icon = (props: IconProps) => {
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

Icon.displayName = 'Chevron'

export const Chevron = memo<IconProps>(themed(Icon))
