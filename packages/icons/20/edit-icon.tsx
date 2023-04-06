import { useTheme } from '@tamagui/core'
import { Path, Svg } from 'react-native-svg'

import type { IconProps } from '../types'

const SvgEditIcon = (props: IconProps) => {
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
        d="m15.763 4.237-.048-.048c-.282-.282-.489-.49-.707-.635a2.65 2.65 0 0 0-2.944 0c-.219.146-.426.353-.708.635l-.048.048-5.898 5.898-.041.042c-.264.263-.461.46-.613.694a2.65 2.65 0 0 0-.312.665c-.082.266-.107.544-.14.915l-.006.058-.248 2.736a.65.65 0 0 0 .706.706l2.735-.249.058-.005c.371-.034.65-.06.916-.141.235-.073.458-.177.664-.311.234-.152.431-.35.694-.613l.042-.042 5.898-5.898.048-.048c.282-.282.49-.489.635-.707a2.65 2.65 0 0 0 0-2.945c-.146-.218-.353-.425-.635-.707l-.048-.048Zm-1.477.398c.097.065.207.17.558.521.35.35.456.461.521.558a1.35 1.35 0 0 1 0 1.5c-.065.098-.17.208-.521.559L13.536 9.08l-2.617-2.616 1.309-1.309c.35-.35.46-.456.558-.521a1.35 1.35 0 0 1 1.5 0ZM10 7.384l-3.67 3.67c-.323.323-.416.42-.485.526a1.35 1.35 0 0 0-.158.339c-.037.12-.053.254-.094.708l-.178 1.958 1.958-.178c.454-.041.589-.056.709-.093s.233-.09.338-.159c.105-.069.203-.162.526-.484l3.67-3.67L10 7.383Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgEditIcon
