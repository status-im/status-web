import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgUnmuteIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.838 6.063c0-.418.061-.821.175-1.201L1.92 2.767l.848-.848 1.796 1.795a4.163 4.163 0 0 1 7.6 2.348v.696c0 .525.167 1.036.477 1.459l.358.487a1.82 1.82 0 0 1-.713 2.733l1.796 1.796-.848.848L10.75 11.6H4.47a1.82 1.82 0 0 1-1.468-2.896l.358-.487c.31-.423.478-.934.478-1.459v-.696Zm1.2 0c0-.058.001-.115.004-.172l4.51 4.509H4.47a.62.62 0 0 1-.5-.986l.358-.488c.46-.629.71-1.388.71-2.168v-.696ZM11.53 10.4h-.281L5.432 4.584a2.963 2.963 0 0 1 5.53 1.479v.695c0 .78.25 1.54.71 2.168l.358.488a.62.62 0 0 1-.5.986ZM8 14.35c.468 0 .927-.111 1.35-.323a3.46 3.46 0 0 0 1.112-.894l-.924-.766a2.26 2.26 0 0 1-.724.586A1.814 1.814 0 0 1 8 13.15c-.275 0-.551-.065-.814-.197a2.26 2.26 0 0 1-.724-.586l-.924.766a3.46 3.46 0 0 0 1.111.894c.424.212.883.323 1.351.323Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgUnmuteIcon
