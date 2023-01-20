import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPlay = (props: SvgProps) => {
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
        d="M3.5 4.73c0-1.205 0-1.807.25-2.131a1.2 1.2 0 0 1 .906-.466c.408-.016.899.335 1.88 1.036l1.777 1.269c.737.527 1.106.79 1.237 1.117a1.2 1.2 0 0 1 0 .89c-.13.327-.5.59-1.237 1.117l-1.777 1.27c-.981.7-1.472 1.05-1.88 1.035a1.2 1.2 0 0 1-.906-.466c-.25-.324-.25-.926-.25-2.132V4.731Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPlay
