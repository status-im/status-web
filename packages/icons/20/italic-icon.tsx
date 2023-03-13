import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgItalicIcon = (props: IconProps) => {
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
        d="M14.75 4.5a.75.75 0 0 1-.75.75h-2.448l-1.583 9.5H12a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1 0-1.5h2.448l1.583-9.5H8a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgItalicIcon
