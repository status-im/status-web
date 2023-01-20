import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgConnection = (props: SvgProps) => {
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
        d="M13 17H7l3-8 3 8Z"
        stroke="#000"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Path
        d="M10 9V7M5 3a4.695 4.695 0 0 0-1.468 1.73A5.082 5.082 0 0 0 3 7c0 .792.183 1.572.532 2.27A4.694 4.694 0 0 0 5 11M7 5c-.641.534-1 1.252-1 2s.359 1.466 1 2M15 11a4.694 4.694 0 0 0 1.468-1.73A5.082 5.082 0 0 0 17 7c0-.792-.183-1.572-.532-2.27A4.695 4.695 0 0 0 15 3M13 9c.641-.534 1-1.252 1-2s-.359-1.466-1-2"
        stroke="#000"
        strokeWidth={1.3}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgConnection
