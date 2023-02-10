import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMutualContactIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={24}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Circle cx={15} cy={10} r={7} fill={color} />
      <Circle cx={9} cy={10} r={7} fill={color} fillOpacity={0.3} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 16.326a7 7 0 0 0 0-12.652 7 7 0 0 0 0 12.652Z"
        fill="#354DB3"
      />
    </Svg>
  )
}
export default SvgMutualContactIcon
