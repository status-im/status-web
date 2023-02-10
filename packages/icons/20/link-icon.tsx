import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLinkIcon = (props: SvgProps) => {
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
        d="M9.54 4.59 8.126 6.006l.919.92 1.414-1.415a2.85 2.85 0 1 1 4.03 4.03l-1.414 1.415.92.919 1.414-1.414a4.15 4.15 0 1 0-5.87-5.87Zm3.04 3.748-4.242 4.243-.92-.92 4.243-4.242.92.92ZM4.59 15.41a4.15 4.15 0 0 1 0-5.869l1.415-1.414.919.92L5.51 10.46a2.85 2.85 0 1 0 4.03 4.03l1.415-1.414.919.92-1.415 1.413a4.15 4.15 0 0 1-5.868 0Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgLinkIcon
