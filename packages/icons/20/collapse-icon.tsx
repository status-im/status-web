import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgCollapseIcon = (props: SvgProps) => {
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
        d="M10.85 2.5v6.65h6.65v-1.3h-5.35V2.5h-1.3ZM2.5 12.15h5.35v5.35h1.3v-6.65H2.5v1.3Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgCollapseIcon
