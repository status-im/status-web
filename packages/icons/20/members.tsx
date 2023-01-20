import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMembers = (props: SvgProps) => {
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
        d="M6.15 6a1.85 1.85 0 1 1 3.7 0 1.85 1.85 0 0 1-3.7 0ZM8 2.85a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm-1.25 7.5a4.4 4.4 0 0 0-4.4 4.4c0 1.05.85 1.9 1.9 1.9h7.5a1.9 1.9 0 0 0 1.9-1.9 4.4 4.4 0 0 0-4.4-4.4h-2.5Zm-3.1 4.4a3.1 3.1 0 0 1 3.1-3.1h2.5a3.1 3.1 0 0 1 3.1 3.1.6.6 0 0 1-.6.6h-7.5a.6.6 0 0 1-.6-.6Z"
        fill={color}
      />
      <Path
        d="M13.5 11h.25a3.75 3.75 0 0 1 3.75 3.75c0 .69-.56 1.25-1.25 1.25H14.5M11.81 8c1.152 0 2.087-.895 2.087-2s-.934-2-2.088-2"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgMembers
