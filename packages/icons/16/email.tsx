import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgEmail = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.2 13H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 10.72 2 9.88 2 8.2v-.4c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C4.28 3 5.12 3 6.8 3h2.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C14 5.28 14 6.12 14 7.8v.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C11.72 13 10.88 13 9.2 13Z"
        stroke={color}
        strokeWidth={1.2}
      />
      <Path d="M4.5 5.5 8 8.75l3.5-3.25" stroke={color} strokeWidth={1.2} />
    </Svg>
  )
}
export default SvgEmail
