import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgForwardIcon = (props: SvgProps) => {
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
        d="m14.93 9.65-3.39 3.39.92.92 4.5-4.5.46-.46-.46-.46-4.5-4.5-.92.92 3.39 3.39h-4.559c-1.095 0-1.957 0-2.651.057-.707.057-1.296.177-1.831.45a4.65 4.65 0 0 0-2.032 2.032c-.273.535-.392 1.124-.45 1.83-.057.694-.057 1.556-.057 2.652v.129h1.3v-.1c0-1.13 0-1.94.052-2.574.052-.627.15-1.026.313-1.347a3.35 3.35 0 0 1 1.464-1.464c.321-.163.72-.261 1.347-.313.634-.051 1.443-.052 2.574-.052h4.53Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgForwardIcon
