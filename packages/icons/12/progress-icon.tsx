import { useTheme } from '@tamagui/core'
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgProgressIcon = (props: IconProps) => {
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
      <G clipPath="url(#progress-icon_svg__a)" strokeWidth={1.1}>
        <Path d="M6 1a5 5 0 1 1 0 10A5 5 0 0 1 6 1Z" stroke="#E7EAEE" />
        <Path d="M6 1a5 5 0 0 1 4.755 3.455" stroke={color} />
      </G>
      <Defs>
        <ClipPath id="progress-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgProgressIcon
