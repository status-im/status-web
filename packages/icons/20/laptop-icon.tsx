import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgLaptopIcon = (props: IconProps) => {
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
        d="M7.2 4.35h-.027c-.537 0-.98 0-1.34.03-.373.03-.715.095-1.036.259a2.65 2.65 0 0 0-1.158 1.158c-.164.32-.229.663-.26 1.036-.029.36-.029.803-.029 1.34v4.184A1.65 1.65 0 0 0 1.85 14a2.65 2.65 0 0 0 2.65 2.65h11A2.65 2.65 0 0 0 18.15 14a1.65 1.65 0 0 0-1.5-1.643V8.173c0-.537 0-.98-.03-1.34-.03-.373-.095-.715-.259-1.036a2.65 2.65 0 0 0-1.158-1.158c-.32-.164-.663-.23-1.036-.26-.36-.029-.803-.029-1.34-.029H7.2Zm9.3 9.3h-13a.35.35 0 0 0-.35.35c0 .746.605 1.35 1.35 1.35h11A1.35 1.35 0 0 0 16.85 14a.35.35 0 0 0-.35-.35Zm-1.15-1.3V8.2c0-.57 0-.96-.025-1.26-.024-.294-.067-.446-.122-.553a1.35 1.35 0 0 0-.59-.59c-.107-.054-.259-.098-.552-.122-.301-.024-.69-.025-1.26-.025H7.2c-.572 0-.96 0-1.262.025-.293.024-.445.068-.552.122a1.35 1.35 0 0 0-.59.59c-.054.107-.098.259-.122.552-.024.301-.025.69-.025 1.261v4.15h10.7Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgLaptopIcon
