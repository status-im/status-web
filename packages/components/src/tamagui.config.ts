import { createFont, createTamagui } from '@tamagui/core'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'

import { animations } from './animations'
import { themes } from './themes'
import { tokens } from './tokens'

export type Conf = typeof config

declare module '@tamagui/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface TamaguiCustomConfig extends Conf {}
}

const interFont = createInterFont({
  size: {
    6: 11,
    7: 13,
    8: 15,
    9: 19,
    10: 27
  },
  weight: {
    6: '400',
    7: '500',
    8: '600'
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6
  },
  face: {
    400: { normal: 'Inter' },
    500: { normal: 'Inter' },
    600: { normal: 'InterBold' }
  }
})

const monoFont = createFont({
  family: 'UbuntuMono',
  weight: {
    1: '500'
  },
  letterSpacing: {
    5: 2,
    6: 1,
    7: 0,
    8: -1,
    9: -2,
    10: -3,
    12: -4,
    14: -5,
    15: -6
  },
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 22,
    9: 30,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 124
  },
  lineHeight: {
    1: 14,
    2: 15
  }
})

export const config = createTamagui({
  fonts: {
    inter: interFont,
    mono: monoFont
  },
  themes,
  tokens: {
    colors: {
      ...tokens.color
    },
    ...tokens
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
    pointerCoarse: { pointer: 'coarse' }
  }),
  shorthands,
  animations
})
