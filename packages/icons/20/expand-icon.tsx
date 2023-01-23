import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgExpandIcon = (props: SvgProps) => {
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
        d="M8.5 6.15h5.35v5.35h1.3V4.85H8.5v1.3ZM4.85 8.5v6.65h6.65v-1.3H6.15V8.5h-1.3Z"
        fill="#000"
      />
    </Svg>
  )
}
export default SvgExpandIcon
