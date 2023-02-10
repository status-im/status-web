import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgColorIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        d="M9 6.4C9 8.9 7.212 10 6 10S3 9 3 6.5 6 2 6 2s3 1.9 3 4.4Z"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgColorIcon
