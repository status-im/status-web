import { useTheme } from '@tamagui/core'
import { Path, Rect, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgAccountNumberIcon = (props: IconProps) => {
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
      <Rect x={2.5} y={2.5} width={15} height={15} rx={3.5} stroke={color} />
      <Path
        d="M11.322 6v8H9.873V7.41h-.047l-1.87 1.195V7.277L9.942 6h1.38Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgAccountNumberIcon
