import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgFlagIcon = (props: SvgProps) => {
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
        d="M5.65 3.35V3h-1.3v14h1.3v-5.35h2.71c.073.564.556 1 1.14 1H15a.65.65 0 0 0 .65-.65V5a.65.65 0 0 0-.65-.65h-3.36a1.15 1.15 0 0 0-1.14-1H5.65Zm0 1.3v5.7H8.5a1.15 1.15 0 0 1 1.14 1h4.71v-5.7H11.5a1.15 1.15 0 0 1-1.14-1H5.65Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgFlagIcon
