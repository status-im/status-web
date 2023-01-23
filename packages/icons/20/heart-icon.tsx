import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgHeartIcon = (props: SvgProps) => {
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
        clipRule="evenodd"
        d="M9.824 16.894a25.629 25.629 0 0 1-4.437-3.406 8.693 8.693 0 0 1-2.112-3.32C2.482 7.739 3.408 4.957 6 4.135 7.362 3.7 8.856 4.65 10.004 5.5c1.148-.848 2.628-1.797 3.99-1.366 2.592.823 3.525 3.605 2.732 6.034a8.694 8.694 0 0 1-2.112 3.32 25.63 25.63 0 0 1-4.437 3.406l-.173.106-.18-.106Z"
        stroke={color}
        strokeWidth={1.3}
      />
    </Svg>
  )
}
export default SvgHeartIcon
