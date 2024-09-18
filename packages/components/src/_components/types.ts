export type IconElement = React.ReactElement<
  React.ComponentPropsWithoutRef<'svg'>
>

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {} // eslint-disable-line @typescript-eslint/ban-types
