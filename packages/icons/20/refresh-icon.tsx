import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgRefreshIcon = (props: IconProps) => {
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
        d="M8.583 3.503 7.54 2.46l.92-.92 2 2 .358.36-.26.434-1.5 2.5-1.115-.668.822-1.372a5.35 5.35 0 1 0 5.868 2.531l1.126-.65a6.65 6.65 0 1 1-7.176-3.172Z"
        fill="#000"
      />
    </Svg>
  )
}
export default SvgRefreshIcon
