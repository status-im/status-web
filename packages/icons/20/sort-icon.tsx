import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgSortIcon = (props: SvgProps) => {
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
        d="M12.85 14.43V3.5h1.3v10.93l1.89-1.89.92.92-3 3-.46.46-.46-.46-3-3 .92-.92 1.89 1.89ZM7.15 5.57l1.89 1.89.92-.92-3-3-.46-.46-.46.46-3 3 .92.92 1.89-1.89V16.5h1.3V5.57Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgSortIcon
