import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgMentionIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.708 1.625a6.6 6.6 0 1 0 1.592 12.09l-.6-1.038A5.4 5.4 0 1 1 13.4 8v.126a24.795 24.795 0 0 1-.058 1.42c-.034.475-.445.854-1.017.854A1.225 1.225 0 0 1 11.1 9.175V4.5H9.9v1.05a3.1 3.1 0 1 0 .245 4.688 2.425 2.425 0 0 0 2.18 1.362c1.103 0 2.128-.771 2.214-1.967a24.716 24.716 0 0 0 .06-1.595l.001-.028V8.001l-.6-.001h.6a6.6 6.6 0 0 0-4.892-6.375ZM8 9.9a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgMentionIcon
