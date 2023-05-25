import { getColorWithOpacity } from '../../utils/get-color-with-opacity'
import { tokens } from '../tokens'

import type { TagProps } from './tag'
import type { ColorTokens, StackStyleProps } from '@tamagui/core'

// TypeGuard for ColorTokens
function isColorTokens(value: string | ColorTokens): value is ColorTokens {
  return typeof value === 'string' && value.startsWith('$')
}

/**
 * Gets the styles for the custom tag
 * @param props - the props of the tag
 * @returns the styles for the custom tag or null if no color is provided
 **/
const getCustomStyles = (props: TagProps): StackStyleProps | null => {
  const { color: colorFromProps, icon } = props

  if (!colorFromProps) {
    return null
  }

  let color = colorFromProps

  if (isColorTokens(colorFromProps)) {
    const colorToken = colorFromProps.replace(
      '$',
      ''
    ) as keyof typeof tokens.color
    color = tokens.color[colorToken]?.val || colorFromProps
  }

  if (icon) {
    return {
      borderColor: getColorWithOpacity(color!, 0.2),
      backgroundColor: getColorWithOpacity(color!, 0.1),
      pressStyle: {
        backgroundColor: getColorWithOpacity(color, 0.2),
        borderColor: getColorWithOpacity(color, 0.3),
      },
      hoverStyle: {
        backgroundColor: getColorWithOpacity(color, 0.2),
        borderColor: getColorWithOpacity(color, 0.3),
      },
    }
  }

  return {
    borderColor: getColorWithOpacity(color, 0.2),
    pressStyle: {
      borderColor: getColorWithOpacity(color, 0.3),
      backgroundColor: getColorWithOpacity(color, 0.1),
    },
    hoverStyle: {
      borderColor: getColorWithOpacity(color, 0.3),
      backgroundColor: getColorWithOpacity(color, 0.1),
    },
  }
}

export { getCustomStyles }
