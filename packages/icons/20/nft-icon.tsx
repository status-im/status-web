import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgNftIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M3.886 12.4c-.505-.874-.758-1.312-.856-1.776a3 3 0 0 1 0-1.248c.098-.465.35-.902.856-1.776l.978-1.695c.505-.875.758-1.312 1.11-1.63a3 3 0 0 1 1.081-.623c.452-.147.957-.147 1.966-.147h1.958c1.01 0 1.514 0 1.966.147a3 3 0 0 1 1.08.623c.353.318.606.755 1.11 1.63l.98 1.695c.504.874.757 1.311.855 1.776.088.411.088.837 0 1.248-.098.464-.35.902-.856 1.776l-.978 1.695c-.505.874-.758 1.312-1.11 1.63-.313.28-.681.493-1.081.623-.452.147-.957.147-1.966.147H9.02c-1.01 0-1.514 0-1.966-.147-.4-.13-.768-.342-1.08-.623-.353-.318-.606-.755-1.11-1.63l-.98-1.695Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M6 15.5a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Circle
        cx={10}
        cy={8}
        r={2}
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgNftIcon
