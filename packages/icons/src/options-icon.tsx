import { memo } from 'react'

import { Circle, Svg } from 'react-native-svg'

import { themed } from './themed'

import type { IconProps } from './types'

function Icon(props: IconProps) {
  const { color = 'currentColor', size = 20, ...rest } = props

  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...rest}>
      <Circle cx={4.5} cy={10} r={1.5} fill={color} />
      <Circle cx={10} cy={10} r={1.5} fill={color} />
      <Circle cx={15.5} cy={10} r={1.5} fill={color} />
    </Svg>
  )
}

export const OptionsIcon = memo<IconProps>(themed(Icon))
