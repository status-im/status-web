import type {
  ColorTokens,
  GetBaseProps,
  GetProps,
  GetStyledVariants,
  TamaguiComponent,
} from '@tamagui/core'
import type { PressableProps as NativePressableProps } from 'react-native'

type PressableProps = {
  onHoverIn?: VoidFunction
  onHoverOut?: VoidFunction
  onPress?: VoidFunction
  onPressIn?: VoidFunction
  onPressOut?: VoidFunction
  onLongPress?: VoidFunction
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

export type MapColorToken<V> = {
  [key in V & string]: ColorTokens
}

export type GetVariants<A extends TamaguiComponent> = Required<
  GetStyledVariants<A>
>

export type { GetBaseProps, GetProps, PressableProps }
