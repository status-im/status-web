import type { customisation } from '@status-im/colors'

export type IconElement = React.ReactElement<
  React.ComponentPropsWithoutRef<'svg'>
>

export type CustomisationColorType = keyof typeof customisation

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
