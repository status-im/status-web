import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgBrowserIcon = (props: SvgProps) => {
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
        d="M3.9 10a6.1 6.1 0 1 1 12.2 0 6.1 6.1 0 0 1-12.2 0ZM10 2.6a7.4 7.4 0 1 0 0 14.8 7.4 7.4 0 0 0 0-14.8Zm3.13 5.058a.65.65 0 0 0-.788-.789l-4 1-.378.095-.095.378-1 4a.65.65 0 0 0 .789.789l4-1 .378-.095.095-.378 1-4ZM9.037 9.036l2.57-.643-.642 2.571-2.57.643.642-2.571Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgBrowserIcon
