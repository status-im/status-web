import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLockedIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M2.5 7.75c0-.465 0-.697.038-.89A2 2 0 0 1 4.11 5.288c.193-.038.425-.038.89-.038h2c.465 0 .697 0 .89.038A2 2 0 0 1 9.462 6.86c.038.193.038.425.038.89s0 .697-.038.89a2 2 0 0 1-1.572 1.572c-.193.038-.425.038-.89.038H5c-.465 0-.697 0-.89-.038A2 2 0 0 1 2.538 8.64C2.5 8.447 2.5 8.215 2.5 7.75ZM4 3.75a2 2 0 1 1 4 0v1.5H4v-1.5Z"
        stroke={color}
        strokeWidth={1.1}
      />
    </Svg>
  )
}
export default SvgLockedIcon
