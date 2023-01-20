import {
  Circle,
  Defs,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
  Svg,
} from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgSad = (props: SvgProps) => {
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
      <Circle cx={8} cy={8} r={8} fill="#FFD764" />
      <Circle cx={8} cy={8} r={8} fill="url(#sad_svg__a)" />
      <Path
        d="M5.39 11.253a1.5 1.5 0 1 1-2.954-.521c.125-.709.885-1.76 1.595-2.1a.504.504 0 0 1 .579.102c.55.562.905 1.81.78 2.519Z"
        fill="url(#sad_svg__b)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 10.938c-.632 0-1.058.205-1.554.453a.437.437 0 1 1-.392-.782l.003-.002c.503-.251 1.09-.544 1.943-.544s1.431.288 1.932.539l.014.007a.437.437 0 1 1-.392.782c-.496-.248-.915-.454-1.554-.454Z"
        fill="#772622"
      />
      <Path
        d="M13.041 11.847a1.125 1.125 0 1 1-2.215.39c-.09-.507.148-1.382.53-1.828a.448.448 0 0 1 .563-.099c.51.288 1.033 1.03 1.122 1.537Z"
        fill="url(#sad_svg__c)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5.563c.242 0 .438.195.438.437 0 .276.09.471.215.597.126.126.321.215.597.215.276 0 .471-.09.597-.215.126-.126.215-.321.215-.597a.438.438 0 0 1 .875 0c0 .474-.16.904-.471 1.216-.312.311-.742.471-1.216.471s-.904-.16-1.216-.471c-.311-.312-.471-.742-.471-1.216 0-.242.195-.438.437-.438Z"
        fill="#424242"
      />
      <Path
        d="M12.194 8.231a.75.75 0 0 1-1.477.26c-.054-.307.072-.816.286-1.13a.378.378 0 0 1 .536-.094c.309.221.601.657.655.964Z"
        fill="url(#sad_svg__d)"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 5.563c.242 0 .438.195.438.437 0 .276.09.471.215.597.126.126.321.215.597.215.276 0 .471-.09.597-.215.126-.126.216-.321.216-.597a.438.438 0 0 1 .874 0c0 .474-.16.904-.471 1.216-.312.311-.742.471-1.216.471s-.904-.16-1.216-.471c-.311-.312-.472-.742-.472-1.216 0-.242.196-.438.438-.438Z"
        fill="#424242"
      />
      <Defs>
        <LinearGradient
          id="sad_svg__b"
          x1={4.347}
          y1={8.53}
          x2={3.653}
          y2={12.47}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#6BC2FF" />
          <Stop offset={1} stopColor="#2196E8" />
        </LinearGradient>
        <LinearGradient
          id="sad_svg__c"
          x1={11.608}
          y1={10.195}
          x2={12.129}
          y2={13.15}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#6BC2FF" />
          <Stop offset={1} stopColor="#2196E8" />
        </LinearGradient>
        <LinearGradient
          id="sad_svg__d"
          x1={11.239}
          y1={7.13}
          x2={11.586}
          y2={9.1}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#6BC2FF" />
          <Stop offset={1} stopColor="#2196E8" />
        </LinearGradient>
        <RadialGradient
          id="sad_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(124.563 4.521 4.45) scale(13.6611 17.7349)"
        >
          <Stop stopColor="#FFD764" />
          <Stop offset={1} stopColor="#FFB746" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}
export default SvgSad
