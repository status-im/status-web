import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgRefreshIcon = (props: SvgProps) => {
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
        d="M8.583 3.503 7.54 2.46l.92-.92 2 2 .358.36-.26.434-1.5 2.5-1.115-.668.822-1.372a5.35 5.35 0 1 0 5.868 2.531l1.126-.65a6.65 6.65 0 1 1-7.176-3.172Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgRefreshIcon
