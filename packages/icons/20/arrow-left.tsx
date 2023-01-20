import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgArrowLeft = (props: SvgProps) => {
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
        d="m5.57 9.35 3.89-3.89-.92-.92-5 5-.46.46.46.46 5 5 .92-.92-3.89-3.89H16v-1.3H5.57Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgArrowLeft
