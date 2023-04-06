import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgMuteIcon = (props: IconProps) => {
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
        d="M8 1.9a4.163 4.163 0 0 0-4.162 4.162v.696c0 .525-.168 1.036-.478 1.459l-.358.487A1.82 1.82 0 0 0 4.47 11.6h7.06a1.82 1.82 0 0 0 1.468-2.896l-.358-.487a2.466 2.466 0 0 1-.478-1.459v-.696A4.162 4.162 0 0 0 8 1.9ZM5.038 6.062a2.963 2.963 0 0 1 5.925 0v.696c0 .78.248 1.54.71 2.168l.357.488a.62.62 0 0 1-.5.986H4.47a.62.62 0 0 1-.5-.986l.358-.488c.46-.629.71-1.388.71-2.168v-.696ZM8 14.35c.468 0 .927-.111 1.35-.323a3.46 3.46 0 0 0 1.112-.894l-.924-.766a2.26 2.26 0 0 1-.724.586A1.814 1.814 0 0 1 8 13.15c-.275 0-.551-.065-.814-.197a2.26 2.26 0 0 1-.724-.586l-.924.766a3.46 3.46 0 0 0 1.111.894c.424.212.883.323 1.351.323Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgMuteIcon
