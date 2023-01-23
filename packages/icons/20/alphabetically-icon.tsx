import { Path, Rect, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgAlphabeticallyIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8.412 13H7l2.152-6h1.699l1.074 3L13 13h-1.412l-1.562-4.629h-.049L8.412 13Zm-.088-2.358h3.337v.99H8.324v-.99Z"
        fill={color}
      />
      <Rect
        x={3.5}
        y={3.5}
        width={13}
        height={13}
        rx={4}
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgAlphabeticallyIcon
