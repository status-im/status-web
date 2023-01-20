import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgClose = (props: SvgProps) => {
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
        d="m10 10.874 4.543 4.588.914-.924-4.542-4.588 4.443-4.488-.915-.924L10 9.026 5.557 4.538l-.915.924L9.085 9.95l-4.542 4.588.914.924L10 10.874Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgClose
