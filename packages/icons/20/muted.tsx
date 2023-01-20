import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgMuted = (props: SvgProps) => {
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
        d="M5.654 4.735A5.15 5.15 0 0 1 15.15 7.5v.75a3.1 3.1 0 0 0 .62 1.86l.45.6a2.15 2.15 0 0 1-1.211 3.38l2.523 2.523-.92.919-3.381-3.382H5.5a2.15 2.15 0 0 1-1.72-3.44l.45-.6a3.1 3.1 0 0 0 .62-1.86V7.5c0-.524.078-1.03.224-1.507L2.47 3.39l.92-.92 2.264 2.265Zm.517 2.356a3.891 3.891 0 0 0-.021.409v.75a4.4 4.4 0 0 1-.88 2.64l-.45.6a.85.85 0 0 0 .68 1.36h6.43L6.172 7.09Zm7.598 5.759L6.604 5.685A3.85 3.85 0 0 1 13.85 7.5v.75a4.4 4.4 0 0 0 .88 2.64l.45.6a.85.85 0 0 1-.68 1.36h-.73Zm-2.373 4.522a3.65 3.65 0 0 1-3.977-.791l.919-.92a2.35 2.35 0 0 0 3.323 0l.92.92a3.65 3.65 0 0 1-1.184.791Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgMuted
