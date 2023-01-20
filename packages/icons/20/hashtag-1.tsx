import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgHashtag1 = (props: SvgProps) => {
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
        d="M6.35 16.65v-3h-2v-1.3h2v-4.7h-2v-1.3h2v-3h1.3v3h4.7v-3h1.3v3h2v1.3h-2v4.7h2v1.3h-2v3h-1.3v-3h-4.7v3h-1.3Zm6-4.3v-4.7h-4.7v4.7h4.7Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgHashtag1
