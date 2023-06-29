import { useState } from 'react'

import type { PressableProps } from '../types'
import type { MouseEvent } from 'react-native'
import type { ColorTokens } from 'tamagui'

type Config = {
  default: ColorTokens
  hover: ColorTokens
  press: ColorTokens
  active: ColorTokens
}

type Return = {
  color: ColorTokens
  pressableProps: Pick<
    PressableProps,
    'onHoverIn' | 'onHoverOut' | 'onPressIn' | 'onPressOut'
  >
}

export const usePressableColors = (
  styles: Config,
  props: Partial<PressableProps> & {
    'aria-expanded'?: boolean
    'aria-selected'?: boolean
    selected?: boolean
  }
): Return => {
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
      onHoverIn: event => {
        props.onHoverIn?.(event as unknown as MouseEvent)
        setHovered(true)
      },
      onHoverOut: event => {
        props.onHoverOut?.(event as unknown as MouseEvent)
        setHovered(false)
      },
      onPressIn: event => {
        props.onPressIn?.(event)
        setPressed(true)
      },
      onPressOut: event => {
        props.onPressOut?.(event)
        setPressed(false)
      },
    } as const,
  }
}
