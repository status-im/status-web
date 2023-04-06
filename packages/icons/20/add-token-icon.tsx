import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgAddTokenIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={10} cy={10} r={6.75} fill={color} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.65 9.35V6.5h-1.3v2.85H6.5v1.3h2.85v2.85h1.3v-2.85h2.85v-1.3h-2.85Z"
        fill="#fff"
      />
    </Svg>
  )
}
export default SvgAddTokenIcon
