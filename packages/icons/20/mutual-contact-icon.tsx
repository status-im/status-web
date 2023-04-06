import { useTheme } from '@tamagui/core'
import { Circle, Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgMutualContactIcon = (props: IconProps) => {
  const { color: token = '$neutral-100' } = props
  const theme = useTheme()
  /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const color = theme[token]?.val ?? token
  return (
    <Svg
      width={24}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={15} cy={10} r={7} fill="#4360DF" />
      <Circle cx={9} cy={10} r={7} fill="#4360DF" fillOpacity={0.3} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 16.326a7 7 0 0 0 0-12.652 7 7 0 0 0 0 12.652Z"
        fill="#354DB3"
      />
    </Svg>
  )
}
export default SvgMutualContactIcon
