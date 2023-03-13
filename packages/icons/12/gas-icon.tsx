import { useTheme } from '@tamagui/core'
import { ClipPath, Defs, G, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgGasIcon = (props: IconProps) => {
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
      <G clipPath="url(#gas-icon_svg__a)" strokeWidth={1.1}>
        <Path
          d="M7.5 10.5v-6c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C5.898 1.5 5.432 1.5 4.5 1.5c-.932 0-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083C1.5 3.102 1.5 3.568 1.5 4.5v6h6Z"
          stroke={color}
          strokeLinejoin="round"
        />
        <Path d="M7.5 7.5H9a1 1 0 0 0 1-1v-1M10 2.5v2" stroke="#000" />
        <Path stroke={color} strokeLinejoin="round" d="M9.5 4.5h1v1h-1z" />
        <Path d="M1.5 4.5h6" stroke="#000" />
      </G>
      <Defs>
        <ClipPath id="gas-icon_svg__a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}
export default SvgGasIcon
