import type {
  ColorTokens,
  GetBaseProps,
  GetProps,
  GetStyledVariants,
  TamaguiComponent,
} from '@tamagui/core'
import type { PressableProps as NativePressableProps } from 'react-native'

type PressableProps = {
  onHoverIn?: Exclude<NativePressableProps['onHoverIn'], null>
  onHoverOut?: NativePressableProps['onHoverOut']
  onPress?: NativePressableProps['onPress']
  onPressIn?: NativePressableProps['onPressIn']
  onPressOut?: NativePressableProps['onPressOut']
  onLongPress?: NativePressableProps['onLongPress']
  delayHoverIn?: NativePressableProps['delayHoverIn']
  delayHoverOut?: NativePressableProps['delayHoverOut']
  delayLongPress?: NativePressableProps['delayLongPress']
  disabled?: boolean
}

export type MapVariant<
  C extends TamaguiComponent,
  K extends keyof GetStyledVariants<C>,
  V extends GetStyledVariants<C> = GetStyledVariants<C>
> = {
  [key in V[K] & string]: ColorTokens
}

export type GetVariants<A extends TamaguiComponent> = Required<
  GetStyledVariants<A>
>

export type { GetBaseProps, GetProps, PressableProps }
