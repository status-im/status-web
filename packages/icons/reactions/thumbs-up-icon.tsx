import {
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Svg,
} from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgThumbsUpIcon = (props: SvgProps) => {
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
        d="M5.874 15.217c-.053.426-.455.724-.866.602-3.807-1.128-5.72-5.29-3.676-8.76a.477.477 0 0 1 .545-.209l.846.242c.292.083.44.407.374.703-.479 2.111 1.076 5.075 2.597 6.03.188.118.313.327.285.548l-.105.844Z"
        fill="url(#thumbs-up-icon_svg__a)"
      />
      <Path
        d="M12 1.75c0-1-.75-1.75-2-1.75-1 0-1.5.784-1.5 1.75 0 .582.25 1 .25 1.695C8.75 5 8 5.75 7 6.25S4 6.75 4 9c0 2.75 2.75 5.5 6 5.5s6-2.5 6-6c0-2.793-1.734-4.286-4.192-3.066-.292.144-.657.012-.661-.313-.007-.54.173-1.08.353-1.621.25-.75.5-1.25.5-1.75Z"
        fill="#FFD764"
      />
      <Path
        d="M12 1.75c0-1-.75-1.75-2-1.75-1 0-1.5.784-1.5 1.75 0 .582.25 1 .25 1.695C8.75 5 8 5.75 7 6.25S4 6.75 4 9c0 2.75 2.75 5.5 6 5.5s6-2.5 6-6c0-2.793-1.734-4.286-4.192-3.066-.292.144-.657.012-.661-.313-.007-.54.173-1.08.353-1.621.25-.75.5-1.25.5-1.75Z"
        fill="url(#thumbs-up-icon_svg__b)"
      />
      <Defs>
        <RadialGradient
          id="thumbs-up-icon_svg__b"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-4.25003 7.49998 -8.72456 -4.94396 11 6)"
        >
          <Stop stopColor="#FFD764" />
          <Stop offset={1} stopColor="#FFB746" />
        </RadialGradient>
        <LinearGradient
          id="thumbs-up-icon_svg__a"
          x1={3.242}
          y1={6.831}
          x2={3.242}
          y2={15.847}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#6BC2FF" />
          <Stop offset={1} stopColor="#2196E8" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}
export default SvgThumbsUpIcon
