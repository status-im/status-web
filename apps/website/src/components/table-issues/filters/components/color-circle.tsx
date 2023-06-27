import { tokens } from '@status-im/components/src/tokens'

import type { ColorTokens } from '@tamagui/core'

// TypeGuard for ColorTokens
function isColorTokens(
  value: `#${string}` | ColorTokens
): value is ColorTokens {
  return typeof value === 'string' && value.startsWith('$')
}

const ColorCircle = ({
  color: colorFromProps,
  opacity = 40,
  size = 16,
}: {
  color: ColorTokens | `#${string}`
  opacity?: number
  size?: number
}) => {
  if (!colorFromProps) {
    return null
  }

  let color: ColorTokens | string = colorFromProps

  if (isColorTokens(colorFromProps)) {
    const colorToken = colorFromProps.replace(
      '$',
      ''
    ) as keyof typeof tokens.color
    color = tokens.color[colorToken]?.val || colorFromProps
  }

  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: `color-mix(in srgb, ${color} ${opacity}%, transparent)`,
        border: `1px solid ${color}`,
      }}
    />
  )
}

export { ColorCircle }
