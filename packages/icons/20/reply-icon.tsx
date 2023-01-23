import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgReplyIcon = (props: SvgProps) => {
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
        d="m5.569 9.65 3.39 3.39-.919.92-4.5-4.5L3.08 9l.46-.46 4.5-4.5.92.92-3.391 3.39H9.629c1.095 0 1.957 0 2.65.057.708.057 1.297.177 1.832.45a4.65 4.65 0 0 1 2.032 2.032c.272.535.392 1.124.45 1.83.057.694.057 1.556.057 2.652v.129h-1.3v-.1c0-1.13 0-1.94-.053-2.574-.05-.627-.149-1.026-.312-1.347a3.35 3.35 0 0 0-1.464-1.464c-.321-.163-.72-.261-1.347-.313-.634-.051-1.443-.052-2.574-.052H5.569Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgReplyIcon
