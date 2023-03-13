// import 'react-native-svg'

import type { ColorTokens } from '@tamagui/core'
import type { SvgProps } from 'react-native-svg'

declare module 'react-native-svg' {
  export interface SvgProps {
    xmlns?: string
    xmlnsXlink?: string
    xlinkHref?: string
  }
}

// type GetTokenString<A> = A extends string ? `$${A}` : `$${string}`
// export type ColorTokens =
//   | GetTokenString<keyof Tokens['color']>
//   | GetTokenString<keyof ThemeParsed>

export type IconProps = SvgProps & {
  // size?: number | SizeTokens
  color?: ColorTokens
  // style?: StyleObject
}
