import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgArrowUp = (props: SvgProps) => {
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
        d="M5.611 1.611 6 1.222l.389.39 3.5 3.5-.778.777L6.55 3.328V10h-1.1V3.328l-2.561 2.56-.778-.777 3.5-3.5Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgArrowUp
