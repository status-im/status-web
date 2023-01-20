import { memo } from 'react'

import { Circle, Path, Svg } from 'react-native-svg'

import { themed } from './themed'

import type { IconProps } from './types'

export function Icon(props: IconProps) {
  const { color = 'currentColor', size = 20, ...rest } = props

  return (
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      {...rest}
    >
      <Circle cx="10" cy="10" r="6.75" stroke={color} strokeWidth="1.3" />
      <Path
        d="M7.525 12a3.5 3.5 0 0 0 4.95 0"
        stroke={color}
        strokeWidth="1.3"
      />
      <Circle cx="8" cy="8.5" r="1" fill={color} />
      <Circle cx="12" cy="8.5" r="1" fill={color} />
    </Svg>
  )
}

export const ReactionIcon = memo<IconProps>(themed(Icon))
