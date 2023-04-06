import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgDarkIcon = (props: IconProps) => {
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
        d="m7.525 4.025.249.6-.249-.6Zm2.127-.483.627.171.237-.868-.9.048.036.65ZM4.025 7.525l.6.249-.6-.249Zm0 4.95.6-.249-.6.249Zm11.95 0 .6.249-.6-.25Zm.483-2.127.649.035.048-.899-.868.237.17.627Zm-3.58-.227.25-.6-.25.6Zm-3-3-.6.25.6-.25ZM7.775 4.626a5.815 5.815 0 0 1 1.913-.435l-.07-1.298a7.116 7.116 0 0 0-2.34.532l.497 1.2ZM4.626 7.774a5.817 5.817 0 0 1 3.148-3.148l-.497-1.201a7.117 7.117 0 0 0-3.852 3.851l1.2.498Zm0 4.452a5.817 5.817 0 0 1 0-4.452l-1.201-.498a7.117 7.117 0 0 0 0 5.448l1.2-.498Zm3.148 3.148a5.818 5.818 0 0 1-3.148-3.148l-1.201.498a7.117 7.117 0 0 0 3.852 3.851l.497-1.2Zm4.452 0a5.817 5.817 0 0 1-4.452 0l-.497 1.201a7.118 7.118 0 0 0 5.447 0l-.498-1.2Zm3.148-3.148a5.817 5.817 0 0 1-3.148 3.148l.498 1.201a7.117 7.117 0 0 0 3.852-3.851l-1.202-.498Zm.435-1.913a5.816 5.816 0 0 1-.434 1.913l1.2.498a7.117 7.117 0 0 0 .532-2.34l-1.298-.07Zm.478-.592a4.894 4.894 0 0 1-3.16-.2l-.497 1.2a6.193 6.193 0 0 0 3.999.254l-.342-1.254Zm-3.16-.2a4.893 4.893 0 0 1-2.648-2.648l-1.2.497a6.193 6.193 0 0 0 3.351 3.352l.497-1.201ZM10.48 6.873a4.893 4.893 0 0 1-.2-3.16l-1.254-.342a6.193 6.193 0 0 0 .253 4l1.201-.498Z"
        fill="#000"
      />
    </Svg>
  )
}
export default SvgDarkIcon
