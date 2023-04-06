import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgInfo1Icon = (props: IconProps) => {
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
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 1A5 5 0 1 0 6 1a5 5 0 0 0 0 10Zm-.5-2.5v-3h1v3h-1Zm0-5v1h1v-1h-1Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgInfo1Icon
