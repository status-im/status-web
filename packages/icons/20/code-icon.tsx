import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCodeIcon = (props: SvgProps) => {
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
        d="m7.866 16.354 3-13 1.267.292-3 13-1.267-.292ZM2.54 9.54l4-4 .92.92L3.918 10l3.54 3.54-.919.92-4-4-.46-.46.46-.46Zm10.92 4.92 4-4 .459-.46-.46-.46-4-4-.919.92L16.08 10l-3.54 3.54.92.92Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgCodeIcon
