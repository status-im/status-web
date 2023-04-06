import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgDeleteIcon = (props: IconProps) => {
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
        d="M3.5 4h9l-.348 6.96c-.053 1.069-.08 1.604-.305 2.01a2 2 0 0 1-.868.825c-.417.205-.952.205-2.023.205H7.044c-1.07 0-1.606 0-2.023-.204a2 2 0 0 1-.868-.826c-.225-.406-.252-.94-.305-2.01L3.5 4Z"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path d="M1.5 4h13" stroke={color} strokeWidth={1.2} />
      <Path
        d="M10.5 4a2.5 2.5 0 0 0-5 0"
        stroke={color}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <Path d="M9.5 7v4M6.5 7v4" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgDeleteIcon
