import { useTheme } from '@tamagui/core'
import { Circle, ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgCameraIcon = (props: IconProps) => {
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
      <G clipPath="url(#camera-icon_svg__a)" stroke={color} strokeWidth={1.1}>
        <Path d="M1 4.2c0-.94.76-1.7 1.7-1.7h.211c.514 0 .984-.29 1.214-.75.23-.46.7-.75 1.214-.75H6.66c.514 0 .984.29 1.214.75.23.46.7.75 1.214.75H9.3c.94 0 1.7.76 1.7 1.7v2.55c0 1.164 0 1.745-.16 2.214a3 3 0 0 1-1.876 1.877C8.495 11 7.914 11 6.75 11h-1.5c-1.164 0-1.745 0-2.214-.16a3 3 0 0 1-1.877-1.876C1 8.495 1 7.914 1 6.75V4.2Z" />
        <Circle cx={6} cy={6.5} r={2} />
      </G>
      <Defs>
        <ClipPath id="camera-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgCameraIcon
