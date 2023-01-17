import type { SizeTokens, StyleObject } from '@tamagui/core'
import type { SvgProps } from 'react-native-svg'

export type EmojiProps = SvgProps & {
  size?: number | SizeTokens
  style?: StyleObject
  sizeBackground?: number
  hasBackground?: boolean
}
