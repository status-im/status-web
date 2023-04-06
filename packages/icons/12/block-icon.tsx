import { useTheme } from '@tamagui/core'
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgBlockIcon = (props: IconProps) => {
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
      <G clipPath="url(#block-icon_svg__a)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.05 6a3.95 3.95 0 0 1 6.327-3.155L2.845 8.377A3.933 3.933 0 0 1 2.05 6Zm1.573 3.155a3.95 3.95 0 0 0 5.532-5.532L3.623 9.155ZM6 .95a5.05 5.05 0 1 0 0 10.1A5.05 5.05 0 0 0 6 .95Z"
          fill="#E65F5C"
        />
      </G>
      <Defs>
        <ClipPath id="block-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgBlockIcon
