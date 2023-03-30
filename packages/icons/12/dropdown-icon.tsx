import { useTheme } from '@tamagui/core'
import { Circle, ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgDropdownIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G clipPath="url(#dropdown-icon_svg__a)">
        <Circle cx={6} cy={6} r={6} fill="#E7EAEE" />
        <Path d="m3 4.75 3 3 3-3" stroke={color} strokeWidth={1.1} />
      </G>
      <Defs>
        <ClipPath id="dropdown-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgDropdownIcon