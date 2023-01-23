import {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Svg,
} from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLoadingIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#loading-icon_svg__a)">
        <Path
          d="M6 .95a.55.55 0 1 1 0 1.1V.95ZM2.05 6A3.95 3.95 0 0 0 6 9.95v1.1A5.05 5.05 0 0 1 .95 6h1.1ZM6 2.05A3.95 3.95 0 0 0 2.05 6H.95A5.05 5.05 0 0 1 6 .95v1.1Z"
          fill={color}
        />
        <Path
          d="M6 1.5a4.5 4.5 0 0 1 0 9"
          stroke="url(#loading-icon_svg__b)"
          strokeWidth={1.1}
        />
      </G>
      <Defs>
        <LinearGradient
          id="loading-icon_svg__b"
          x1={5.625}
          y1={10.5}
          x2={2.625}
          y2={5.25}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={color} />
          <Stop offset={1} stopColor={color} stopOpacity={0} />
        </LinearGradient>
        <ClipPath id="loading-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgLoadingIcon
