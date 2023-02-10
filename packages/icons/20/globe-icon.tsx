import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgGlobeIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.28 4.251c.275-.261.517-.351.72-.351.203 0 .445.09.72.351.278.265.558.679.807 1.24.438.983.741 2.33.809 3.859H7.664c.068-1.528.372-2.876.809-3.859.25-.561.53-.975.807-1.24ZM6.363 9.35c.069-1.68.4-3.214.922-4.387a6.95 6.95 0 0 1 .276-.556A6.105 6.105 0 0 0 3.934 9.35h2.43Zm-2.429 1.3h2.43c.068 1.68.4 3.214.92 4.387.087.193.179.38.277.556a6.105 6.105 0 0 1-3.627-4.943Zm3.73 0h4.672c-.068 1.528-.372 2.876-.809 3.859-.249.561-.53.975-.807 1.24-.275.261-.517.351-.72.351-.203 0-.445-.09-.72-.351-.278-.265-.558-.679-.807-1.24-.437-.983-.74-2.33-.809-3.859Zm5.973 0c-.069 1.68-.4 3.214-.922 4.387a6.95 6.95 0 0 1-.276.556 6.105 6.105 0 0 0 3.627-4.943h-2.43Zm2.429-1.3a6.105 6.105 0 0 0-3.627-4.943c.098.177.19.363.276.556.522 1.173.854 2.707.922 4.387h2.429ZM17.4 10a7.4 7.4 0 1 1-14.8 0 7.4 7.4 0 0 1 14.8 0Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgGlobeIcon
