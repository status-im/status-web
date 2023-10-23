import {
  blur,
  customisation,
  danger,
  networks,
  neutral,
  security,
  social,
  success,
  white,
} from '@status-im/colors'
import { createTokens } from '@tamagui/core'
import { size, space, zIndex } from '@tamagui/themes'

function prefixColors(prefix: string, color: Record<string, string>) {
  return Object.entries(color).reduce((acc, [key, value]) => {
    acc[`${prefix}-${key}`] = value
    return acc
  }, {} as Record<string, string>)
}

export const tokens = createTokens({
  color: {
    ...blur,
    ...customisation,
    ...(prefixColors('danger', danger) as {
      [K in keyof typeof danger as `danger-${K}`]: (typeof danger)[K]
    }),
    ...networks,
    ...(prefixColors('neutral', neutral) as {
      [K in keyof typeof neutral as `neutral-${K}`]: (typeof neutral)[K]
    }),
    ...security,
    ...social,
    ...(prefixColors('success', success) as {
      [K in keyof typeof success as `success-${K}`]: (typeof success)[K]
    }),
    ...(prefixColors('white', white) as {
      [K in keyof typeof white as `white-${K}`]: (typeof white)[K]
    }),

    transparent: 'hsla(0, 0%, 0%, 0)',
  },
  size,
  space,
  zIndex,
  radius: {
    0: 0,
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    16: 16,
    20: 20,
    full: 1000,
  },
})

type GetTokenString<A> = A extends string | number ? `$${A}` : `$${string}`
type RadiusTokens = GetTokenString<keyof typeof tokens.radius> | number

export { type RadiusTokens }
