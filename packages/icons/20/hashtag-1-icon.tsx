import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgHashtag1Icon = (props: IconProps) => {
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
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.35 16.65v-3h-2v-1.3h2v-4.7h-2v-1.3h2v-3h1.3v3h4.7v-3h1.3v3h2v1.3h-2v4.7h2v1.3h-2v3h-1.3v-3h-4.7v3h-1.3Zm6-4.3v-4.7h-4.7v4.7h4.7Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgHashtag1Icon
