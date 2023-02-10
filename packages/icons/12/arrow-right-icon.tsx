import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgArrowRightIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.389 6.389 10.778 6l-.39-.389-3.5-3.5-.777.778L8.672 5.45H2v1.1h6.672l-2.56 2.561.777.778 3.5-3.5Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgArrowRightIcon
