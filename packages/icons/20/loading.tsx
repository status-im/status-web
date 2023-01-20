import { Defs, LinearGradient, Path, Stop, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLoading = (props: SvgProps) => {
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
        d="M10 2.25a.75.75 0 0 1 0 1.5v-1.5ZM3.75 10A6.25 6.25 0 0 0 10 16.25v1.5A7.75 7.75 0 0 1 2.25 10h1.5ZM10 3.75A6.25 6.25 0 0 0 3.75 10h-1.5A7.75 7.75 0 0 1 10 2.25v1.5Z"
        fill={color}
      />
      <Path
        d="M10 3a7 7 0 1 1 0 14"
        stroke="url(#loading_svg__a)"
        strokeWidth={1.5}
      />
      <Defs>
        <LinearGradient
          id="loading_svg__a"
          x1={9.417}
          y1={17}
          x2={4.75}
          y2={8.833}
          gradientUnits="userSpaceOnUse"
        >
          <Stop />
          <Stop offset={1} stopColor="#15161A" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}
export default SvgLoading
