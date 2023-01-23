import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgArrowDownIcon = (props: SvgProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.55 8.672V2h-1.1v6.672l-2.561-2.56-.778.777 3.5 3.5.389.389.389-.39 3.5-3.5-.778-.777L6.55 8.672Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgArrowDownIcon
