import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPlaceholderIcon = (props: SvgProps) => {
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
        d="M10 15.7c1.34 0 2.572-.462 3.545-1.236l-3.66-3.66-3.445 3.648A5.676 5.676 0 0 0 10 15.7Zm-4.477-2.171 3.442-3.645-3.429-3.429A5.676 5.676 0 0 0 4.3 10c0 1.332.457 2.558 1.223 3.529Zm4.335-4.59L6.455 5.536A5.676 5.676 0 0 1 10 4.3c1.216 0 2.342.38 3.268 1.029l-3.41 3.61Zm.92.92 3.463-3.667A5.679 5.679 0 0 1 15.7 10c0 1.34-.462 2.572-1.236 3.545l-3.686-3.687ZM10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPlaceholderIcon
