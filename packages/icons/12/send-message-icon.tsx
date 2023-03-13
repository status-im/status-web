import { useTheme } from '@tamagui/core'
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgSendMessageIcon = (props: IconProps) => {
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
      <G
        clipPath="url(#send-message-icon_svg__a)"
        stroke="#000"
        strokeWidth={1.1}
      >
        <Path d="m2.495 5.511 5.466-3.609a1 1 0 0 1 1.55.894l-.393 6.539c-.055.918-1.216 1.28-1.784.558L5.63 7.728l-2.727-.393c-.91-.13-1.175-1.317-.408-1.824ZM9.13 1.666l-3.5 6.062" />
      </G>
      <Defs>
        <ClipPath id="send-message-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgSendMessageIcon
