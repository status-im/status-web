import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgHistoryIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.6 4.204V3H1.4v3.6h3.1V5.4H3.266a5.4 5.4 0 1 1-.534 3.792l-1.165.291A6.6 6.6 0 1 0 2.6 4.204Z"
        fill="#000"
      />
      <Path d="M7.5 5v3l2.5 2.5" stroke="#000" strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgHistoryIcon
