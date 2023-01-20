import type {
  SizeTokens,
  StyleObject,
  ThemeParsed,
  Tokens,
} from '@tamagui/core'
import type { SvgProps } from 'react-native-svg'

type GetTokenString<A> = A extends string ? `$${A}` : `$${string}`
export type ColorTokens =
  | GetTokenString<keyof Tokens['color']>
  | GetTokenString<keyof ThemeParsed>

export type IconProps = SvgProps & {
  size?: number | SizeTokens
  color?: ColorTokens
  style?: StyleObject
}
