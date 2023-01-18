import { useCurrentColor } from 'tamagui'

import type { IconProps } from './IconProps'
import type React from 'react'

export function themed(Component: React.ElementType) {
  const useWrapped = (props: IconProps) => {
    const { size, color: colorToken = '$neutral-100', ...rest } = props

    const color = useCurrentColor(colorToken)

    return <Component {...rest} color={color} size={size} />
  }
  return useWrapped
}
