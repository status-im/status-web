import { createTheme } from '@tamagui/core'

import { tokens } from './tokens'

const light = createTheme({
  background: tokens.color['white-100'],
  textPrimary: tokens.color['neutral-100'],
  primary: tokens.color['primary-50'],
  primaryHover: tokens.color['primary-60'],
  success: tokens.color['success-50'],
  successHover: tokens.color['success-60'],
  danger: tokens.color['danger-50'],
  dangerHover: tokens.color['danger-60'],
  purple: tokens.color['purple-50'],
  purpleHover: tokens.color['purple-60'],
  indigo: tokens.color['indigo-50'],
  indigoHover: tokens.color['indigo-60'],
  turquoise: tokens.color['turquoise-50'],
  turquoiseHover: tokens.color['turquoise-60'],
  blue: tokens.color['blue-50'],
  blueHover: tokens.color['blue-60'],
  green: tokens.color['green-50'],
  greenHover: tokens.color['green-60'],
  yellow: tokens.color['yellow-50'],
  yellowHover: tokens.color['yellow-60'],
  orange: tokens.color['orange-50'],
  orangeHover: tokens.color['orange-60'],
  red: tokens.color['red-50'],
  redHover: tokens.color['red-60'],
  pink: tokens.color['pink-50'],
  pinkHover: tokens.color['pink-60'],
  brown: tokens.color['brown-50'],
  brownHover: tokens.color['brown-60'],
  beige: tokens.color['beige-50'],
  beigeHover: tokens.color['beige-60'],
})

// note: we set up a single consistent base type to validate the rest:
type BaseTheme = typeof light

const dark: BaseTheme = createTheme({
  background: tokens.color['neutral-95'],
  textPrimary: tokens.color['white-100'],
  primary: tokens.color['primary-60'],
  primaryHover: tokens.color['primary-50'],
  success: tokens.color['success-60'],
  successHover: tokens.color['success-50'],
  danger: tokens.color['danger-60'],
  dangerHover: tokens.color['danger-50'],
  purple: tokens.color['purple-60'],
  purpleHover: tokens.color['purple-50'],
  indigo: tokens.color['indigo-60'],
  indigoHover: tokens.color['indigo-50'],
  turquoise: tokens.color['turquoise-60'],
  turquoiseHover: tokens.color['turquoise-50'],
  blue: tokens.color['blue-60'],
  blueHover: tokens.color['blue-50'],
  green: tokens.color['green-60'],
  greenHover: tokens.color['green-50'],
  yellow: tokens.color['yellow-60'],
  yellowHover: tokens.color['yellow-50'],
  orange: tokens.color['orange-60'],
  orangeHover: tokens.color['orange-50'],
  red: tokens.color['red-60'],
  redHover: tokens.color['red-50'],
  pink: tokens.color['pink-60'],
  pinkHover: tokens.color['pink-50'],
  brown: tokens.color['brown-60'],
  brownHover: tokens.color['brown-50'],
  beige: tokens.color['beige-60'],
  beigeHover: tokens.color['beige-50'],
})

const allThemes = {
  light,
  dark,
}

type ThemeName = keyof typeof allThemes

type Themes = {
  [key in ThemeName]: BaseTheme
}

export const themes: Themes = allThemes
