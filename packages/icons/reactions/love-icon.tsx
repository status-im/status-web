import { Defs, Path, RadialGradient, Stop, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLoveIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.5 5.5C.5 10 5.79 15 8 15s7.5-5 7.5-9.5c0-2.21-1.5-4-3.5-4-1.758 0-3.25.791-3.787 2.5-.107.25-.16.25-.213.25-.053 0-.106 0-.213-.25C7.251 2.291 5.757 1.5 4 1.5 2 1.5.5 3.29.5 5.5Z"
        fill="#E45852"
      />
      <Path
        d="M.5 5.5C.5 10 5.79 15 8 15s7.5-5 7.5-9.5c0-2.21-1.5-4-3.5-4-1.758 0-3.25.791-3.787 2.5-.107.25-.16.25-.213.25-.053 0-.106 0-.213-.25C7.251 2.291 5.757 1.5 4 1.5 2 1.5.5 3.29.5 5.5Z"
        fill="url(#love-icon_svg__a)"
      />
      <Defs>
        <RadialGradient
          id="love-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(93.897 1.536 6.375) scale(10.3452 9.89501)"
        >
          <Stop stopColor="#F05D56" />
          <Stop offset={1} stopColor="#D15954" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}
export default SvgLoveIcon
