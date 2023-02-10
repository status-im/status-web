import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPlaceholderIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 2c-.924 0-1.776.314-2.453.84L6 5.293 8.453 2.84A3.983 3.983 0 0 0 6 2Zm3.16 1.547L6.707 6 9.16 8.453C9.686 7.776 10 6.924 10 6c0-.924-.314-1.776-.84-2.453ZM5.293 6 2.84 3.547A3.983 3.983 0 0 0 2 6c0 .924.314 1.775.84 2.453L5.293 6ZM3.547 9.16 6 6.707 8.453 9.16A3.983 3.983 0 0 1 6 10a3.983 3.983 0 0 1-2.453-.84ZM1 6a5 5 0 1 1 10 0A5 5 0 0 1 1 6Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPlaceholderIcon
