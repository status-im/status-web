import { useState } from 'react'

import type { ColorTokens } from 'tamagui'

type Config = {
  default: ColorTokens
  hover: ColorTokens
  press: ColorTokens
  active: ColorTokens
}

export const usePressableColors = (
  styles: Config,
  props: {
    'aria-expanded'?: boolean
    'aria-selected'?: boolean
    selected?: boolean
  }
) => {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  /**
   * Order of precedence:
   * 1. active
   * 2. press
   * 3. hover
   * 4. default
   */
  const key =
    props['aria-expanded'] || props['aria-selected']
      ? 'active'
      : pressed
      ? 'press'
      : hovered
      ? 'hover'
      : 'default'

  return {
    color: styles[key],
    pressableProps: {
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
      onPressIn: () => setPressed(true),
      onPressOut: () => setPressed(false),
    } as const,
  }
}
