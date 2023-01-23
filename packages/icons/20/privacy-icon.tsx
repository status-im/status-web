import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPrivacyIcon = (props: SvgProps) => {
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
        d="M6.5 12.15a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7ZM3.85 13.5a2.65 2.65 0 0 1 5.127-.944 3.357 3.357 0 0 1 2.046 0 2.651 2.651 0 1 1-.144 1.337 2.055 2.055 0 0 0-1.758 0 2.65 2.65 0 0 1-5.27-.393Zm9.65-1.35a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7ZM6.96 4.532a.35.35 0 0 1 .561-.091l1.02 1.019 1 1 .503.503.455-.547 1.587-1.904a.35.35 0 0 1 .571.048l2.211 3.79H5.052L6.96 4.532ZM3.599 8.35l2.2-4.4a1.65 1.65 0 0 1 2.643-.429l1.019 1.02.496.496 1.131-1.357a1.65 1.65 0 0 1 2.693.225l2.593 4.445H18v1.3H2v-1.3h1.598Z"
        fill="#000"
      />
    </Svg>
  )
}
export default SvgPrivacyIcon
