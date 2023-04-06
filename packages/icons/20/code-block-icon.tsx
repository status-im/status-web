import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgCodeBlockIcon = (props: IconProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="m5.507 7.918 1-6 .986.164-1 6-.986-.164Zm-1.36-5.772-2.5 2.5L1.293 5l.354.354 2.5 2.5.707-.708L2.707 5l2.147-2.146-.707-.708ZM17.15 7.5a4.65 4.65 0 0 0-4.65-4.65v1.3c1.85 0 3.35 1.5 3.35 3.35v2.6c0 1.13 0 1.94-.052 2.574-.052.627-.15 1.026-.313 1.347a3.35 3.35 0 0 1-1.464 1.464c-.321.163-.72.261-1.347.313-.634.052-1.443.052-2.574.052h-.2c-1.13 0-1.94 0-2.574-.052-.627-.052-1.026-.15-1.347-.313a3.35 3.35 0 0 1-1.464-1.464c-.163-.321-.261-.72-.313-1.347-.051-.634-.052-1.443-.052-2.574V9h-1.3v1.129c0 1.096 0 1.958.057 2.651.058.707.177 1.296.45 1.831a4.65 4.65 0 0 0 2.032 2.032c.535.273 1.124.393 1.83.45.694.057 1.557.057 2.652.057h.258c1.096 0 1.958 0 2.651-.057.707-.057 1.296-.177 1.831-.45a4.65 4.65 0 0 0 2.032-2.032c.273-.535.393-1.124.45-1.83.057-.694.057-1.556.057-2.652V7.5Zm-8.296.354 2.5-2.5.353-.354-.353-.354-2.5-2.5-.708.708L10.293 5 8.146 7.146l.708.708Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgCodeBlockIcon
