import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

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
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.9 10a6.1 6.1 0 0 1 9.93-4.749L5.251 13.83A6.074 6.074 0 0 1 3.9 10Zm2.27 4.749a6.1 6.1 0 0 0 8.578-8.578l-8.577 8.578ZM10 2.6a7.4 7.4 0 1 0 0 14.8 7.4 7.4 0 0 0 0-14.8Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgBlockIcon
