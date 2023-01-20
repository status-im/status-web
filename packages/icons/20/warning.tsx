import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgWarning = (props: SvgProps) => {
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
        d="M8.775 3.757c.452-.187.678-.28.912-.318a2 2 0 0 1 .626 0c.234.037.46.131.912.318l2.323.963c.452.187.678.28.87.42a2 2 0 0 1 .442.442c.14.192.233.418.42.87l.963 2.323c.187.452.28.678.318.912.032.207.032.419 0 .626-.037.234-.131.46-.318.912l-.963 2.323c-.187.452-.28.678-.42.87-.123.17-.272.319-.442.442-.192.14-.418.233-.87.42l-2.323.963c-.452.187-.678.28-.912.318a2.002 2.002 0 0 1-.626 0c-.234-.037-.46-.131-.912-.318l-2.323-.963c-.452-.187-.678-.28-.87-.42a2 2 0 0 1-.442-.442c-.14-.192-.233-.418-.42-.87l-.963-2.323c-.187-.452-.28-.678-.318-.912a2 2 0 0 1 0-.626c.037-.234.131-.46.318-.912l.963-2.323c.187-.452.28-.678.42-.87a2 2 0 0 1 .442-.442c.192-.14.418-.233.87-.42l2.323-.963ZM10 7v4"
        stroke={color}
        strokeWidth={1.3}
      />
      <Circle
        cx={10}
        cy={12.5}
        r={0.5}
        fill={color}
        stroke={color}
        strokeWidth={0.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgWarning
