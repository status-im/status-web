import { useTheme } from '@tamagui/core'
import {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Svg,
} from 'react-native-svg'

import type { IconProps } from '../types'

const SvgAngryIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={8} cy={8} r={8} fill="url(#angry-icon_svg__a)" />
      <Circle cx={8} cy={8} r={8} fill="url(#angry-icon_svg__b)" />
      <Path
        d="M3.672 5.598a.438.438 0 0 0-.344.804l1.056.453c.14.06.192.233.151.381a1.001 1.001 0 0 0 1.887.65c.03-.07.11-.11.181-.08l.225.096a.438.438 0 0 0 .344-.804l-3.5-1.5ZM12.33 5.598a.438.438 0 0 1 .345.804l-1.056.453c-.141.06-.192.233-.152.381a1.002 1.002 0 0 1-.965 1.264 1 1 0 0 1-.922-.613c-.03-.071-.11-.111-.18-.081l-.225.096a.437.437 0 0 1-.345-.804l3.5-1.5Z"
        fill="#424242"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10.938a2.56 2.56 0 0 0-2.136 1.145.438.438 0 0 1-.728-.484A3.435 3.435 0 0 1 8 10.062c1.196 0 2.25.612 2.864 1.537a.437.437 0 1 1-.728.484A2.56 2.56 0 0 0 8 10.937Z"
        fill="#772622"
      />
      <Defs>
        <RadialGradient
          id="angry-icon_svg__b"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(124.563 4.521 4.45) scale(13.6611 17.7349)"
        >
          <Stop stopColor="#FFD764" stopOpacity={0.2} />
          <Stop offset={1} stopColor="#FFB746" stopOpacity={0.1} />
        </RadialGradient>
        <LinearGradient
          id="angry-icon_svg__a"
          x1={8}
          y1={0}
          x2={8}
          y2={16}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.11} stopColor="#EA6433" />
          <Stop offset={0.547} stopColor="#F2B660" />
          <Stop offset={1} stopColor="#FFBA49" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}
export default SvgAngryIcon
