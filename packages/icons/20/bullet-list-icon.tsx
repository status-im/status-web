import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgBulletListIcon = (props: IconProps) => {
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
        d="M15 15H8.5M15 5H8.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <Circle
        cx={5.25}
        cy={10}
        r={1.25}
        transform="rotate(-90 5.25 10)"
        fill={color}
      />
      <Circle
        cx={5.25}
        cy={14.75}
        r={1.25}
        transform="rotate(-90 5.25 14.75)"
        fill={color}
      />
      <Circle
        cx={5.25}
        cy={5.25}
        r={1.25}
        transform="rotate(-90 5.25 5.25)"
        fill={color}
      />
      <Path
        d="M15 10H8.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
export default SvgBulletListIcon
