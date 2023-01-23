import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgAttachIcon = (props: SvgProps) => {
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
        d="M10.071 3.707a3.15 3.15 0 1 1 4.455 4.455l-2.475 2.474-.707.708-1.945 1.944a1.9 1.9 0 0 1-2.687-2.687l5.307-5.307.92.92L7.63 11.52a.6.6 0 1 0 .849.849l1.944-1.945.708-.707 2.475-2.475a1.85 1.85 0 1 0-2.617-2.616L5.687 9.929a3.35 3.35 0 0 0 0 4.738 2.85 2.85 0 0 0 4.03 0l4.597-4.596.919.919-4.596 4.596a4.15 4.15 0 0 1-5.87 0 4.65 4.65 0 0 1 0-6.576l5.304-5.303Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgAttachIcon
