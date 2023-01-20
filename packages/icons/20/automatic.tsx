import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgAutomatic = (props: SvgProps) => {
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
        d="M9.25 6.692a4 4 0 1 0 0 6.615A4.98 4.98 0 0 1 8 10c0-1.268.472-2.426 1.25-3.308Z"
        fill="#A1ABBD"
      />
      <Circle cx={13} cy={10} r={4} fill="#26A69A" />
    </Svg>
  )
}
export default SvgAutomatic
