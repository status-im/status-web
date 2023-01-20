import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgArrowDown = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
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
        d="M10.65 14.43V4h-1.3v10.43l-3.89-3.89-.92.92L10 16.92l5.46-5.46-.92-.92-3.89 3.89Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgArrowDown
