import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgPlayIcon = (props: SvgProps) => {
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
        d="M6 6.83c0-1.413 0-2.12.296-2.518a1.5 1.5 0 0 1 1.084-.6c.494-.04 1.094.334 2.292 1.083l5.072 3.17c1.08.675 1.62 1.012 1.805 1.444a1.5 1.5 0 0 1 0 1.182c-.186.432-.726.77-1.805 1.444l-5.072 3.17c-1.198.749-1.798 1.124-2.292 1.084a1.5 1.5 0 0 1-1.084-.601C6 15.29 6 14.583 6 13.17V6.83Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgPlayIcon
