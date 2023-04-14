import { createElement, forwardRef } from 'react'

import { useTheme } from '@tamagui/core'

import type { ColorTokens } from '@tamagui/core'
import type { ComponentType, SVGProps } from 'react'

// import 'react-native-svg'
// declare module 'react-native-svg' {
//   export interface SvgProps {
//     xmlns?: string
//     xmlnsXlink?: string
//     xlinkHref?: string
//   }
// }

export interface IconProps extends SVGProps<SVGSVGElement> {
  size: 12 | 16 | 20
  color?: ColorTokens
}

export function createIcon<P extends SVGProps<SVGSVGElement>>(
  Component: ComponentType<P>
): ComponentType<IconProps> {
  const Icon = forwardRef<SVGElement, IconProps>((props, ref) => {
    const { size, color = '$neutral-100', ...rest } = props
    const theme = useTheme()
    const token = theme[color]?.val

    return createElement(Component, {
      ref,
      ...(rest as P),
      color: token,
      width: size,
      height: size,
    })
  })

  Icon.displayName = Component.name + 'Icon'

  return Icon as ComponentType<IconProps>
}
