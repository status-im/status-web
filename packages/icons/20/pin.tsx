import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPin = (props: SvgProps) => {
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
        d="m10.121 3.303-.954-.955-.92.92.955.954-4.737 4.737-.601-.6-.92.919.601.6.46.46 2.369 2.37L2.59 16.49l.92.92 3.782-3.784 2.369 2.37.46.459.6.6.92-.918-.601-.601 4.737-4.738.955.954.919-.919-.954-.954-.46-.46-5.657-5.657-.46-.46Zm0 1.838L14.86 9.88l-4.738 4.737L5.384 9.88 10.12 5.14Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPin
