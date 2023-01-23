import { Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgSyncingIcon = (props: SvgProps) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3.35a4.15 4.15 0 0 0-4.095 3.478 4.536 4.536 0 0 0-1.374.247A3.158 3.158 0 0 0 3.024 8.17c-.425.577-.674 1.344-.674 2.331a.65.65 0 1 0 1.3 0c0-.763.189-1.246.42-1.56a1.86 1.86 0 0 1 .899-.64 3.257 3.257 0 0 1 1-.174 3.56 3.56 0 0 1 .421.015l.018.003h.003-.001a.65.65 0 0 0 .74-.644 2.85 2.85 0 1 1 5.7 0 .65.65 0 0 0 .741.644l.02-.003a3.56 3.56 0 0 1 .421-.015c.285.007.648.048 1 .174.347.124.664.323.898.64.231.314.42.797.42 1.56 0 .761-.188 1.289-.438 1.663a2.423 2.423 0 0 1-.953.818 3.651 3.651 0 0 1-1.441.369H7.569l1.89-1.89-.919-.92-3 3-.46.46.46.46 3 3 .92-.92-1.89-1.89h5.93V14v.65H13.522a3.866 3.866 0 0 0 .633-.064c.37-.061.875-.186 1.387-.442a3.721 3.721 0 0 0 1.453-1.26c.407-.61.656-1.395.656-2.384 0-.987-.248-1.754-.673-2.33a3.157 3.157 0 0 0-1.508-1.095 4.535 4.535 0 0 0-1.374-.247A4.149 4.149 0 0 0 10 3.35ZM6.408 8.144 6.5 7.5c-.092.643-.092.644-.091.644Z"
        fill={color}
      />
    </Svg>
  )
}
export default SvgSyncingIcon
