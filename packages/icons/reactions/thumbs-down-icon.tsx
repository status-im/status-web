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

const SvgThumbsDownIcon = (props: SvgProps) => {
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
        d="M4.5 14.097c0 1.25 1.284 1.75 2.25 1.75S8 15.063 8 14.097c0-.583-.25-1-.25-1.695 0-1.555 1.083-2.305 1.75-2.805 1-.75 3-.75 3-2.75 0-2.75-2.75-5.5-6-5.5a6 6 0 0 0-6 6c0 2.899 1.868 4.397 4.475 2.915.142-.08.325-.015.347.146.088.655-.193 1.331-.491 1.994-.331.695-.331 1.195-.331 1.695Z"
        fill="#FFD764"
      />
      <Path
        d="M4.5 14.097c0 1.25 1.284 1.75 2.25 1.75S8 15.063 8 14.097c0-.583-.25-1-.25-1.695 0-1.555 1.083-2.305 1.75-2.805 1-.75 3-.75 3-2.75 0-2.75-2.75-5.5-6-5.5a6 6 0 0 0-6 6c0 2.899 1.868 4.397 4.475 2.915.142-.08.325-.015.347.146.088.655-.193 1.331-.491 1.994-.331.695-.331 1.195-.331 1.695Z"
        fill="url(#thumbs-down-icon_svg__a)"
      />
      <Path
        d="M10.626.63c.054-.426.455-.724.866-.602 3.807 1.128 5.72 5.29 3.676 8.759a.477.477 0 0 1-.545.21l-.846-.242c-.292-.084-.44-.408-.373-.704.478-2.11-1.077-5.074-2.598-6.029-.188-.118-.313-.328-.285-.549l.105-.843Z"
        fill="url(#thumbs-down-icon_svg__b)"
      />
      <Defs>
        <RadialGradient
          id="thumbs-down-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(4 -7.5 8.72458 4.65311 5.5 9.75)"
        >
          <Stop stopColor="#FFD764" />
          <Stop offset={1} stopColor="#FFB746" />
        </RadialGradient>
        <LinearGradient
          id="thumbs-down-icon_svg__b"
          x1={13.258}
          y1={9.016}
          x2={13.258}
          y2={0}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#2196E8" />
          <Stop offset={1} stopColor="#6BC2FF" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}
export default SvgThumbsDownIcon
