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
}: {
  color?: ColorTokens | `#${string}`
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
        width: 16,
        height: 16,
        backgroundColor: `color-mix(in srgb, ${color} ${40}%, transparent)`,
        border: `1px solid ${color}`,
      }}
    />
  )
}

export { ColorCircle }
