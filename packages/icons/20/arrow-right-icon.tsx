import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgArrowRightIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m14.43 10.65-3.89 3.89.92.92 5-5 .46-.46-.46-.46-5-5-.92.92 3.89 3.89H4v1.3h10.43Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgArrowRightIcon
