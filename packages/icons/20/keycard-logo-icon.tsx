import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgKeycardLogoIcon = (props: SvgProps) => {
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
        d="M8.144 9.845C6.344 9.465 5 7.848 5 5.94A3.937 3.937 0 0 1 8.953 2a3.937 3.937 0 0 1 3.953 3.94c.041 1.875-1.286 3.47-3.048 3.884v3.95h.095l2.096-2.468h2l-2.476 2.848L14.193 18h-1.858l-1.905-2.754-.572.665V18H8.144V9.845ZM6.572 5.94a2.385 2.385 0 0 1 2.381-2.374c1.334 0 2.43 1.092 2.382 2.374a2.385 2.385 0 0 1-2.382 2.373c-1.286 0-2.381-1.044-2.381-2.373Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgKeycardLogoIcon
