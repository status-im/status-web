import { createFont, createTamagui } from '@tamagui/core'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'

import { animations } from './animations'
import { themes } from './themes'
import { tokens } from './tokens'

import type {
  ColorTokens,
  GetStyledVariants,
  TamaguiComponent,
} from '@tamagui/core'

export type Conf = typeof config

declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}
}

export const config = createTamagui({
  fonts: {
    sans: createInterFont({
      size: {},
      weight: {},
      letterSpacing: {},
      face: {
        400: { normal: 'Inter' },
        500: { normal: 'Inter' },
        600: { normal: 'InterBold' },
      },
    }),
    mono: createFont({
      family:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
      weight: {},
      letterSpacing: {},
      size: {},
      lineHeight: {},
    }),
    // Tamagui requires this... weird
    body: createInterFont({}),
  },
  themes,
  tokens: {
    colors: {
      ...tokens.color,
    },
    ...tokens,
  },
  shouldAddPrefersColorThemes: true,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
  shorthands,
  animations,
})

export type TextColor<
  C extends TamaguiComponent,
  K extends keyof V,
  V extends GetStyledVariants<C> = GetStyledVariants<C>
> = {
  [P in V[K] & string]: ColorTokens
}
