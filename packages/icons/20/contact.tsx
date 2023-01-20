import { Circle, Path, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgContact = (props: SvgProps) => {
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
      <Circle
        cx={10}
        cy={10}
        r={6.75}
        fill="#4360DF"
        stroke="#4360DF"
        strokeWidth={1.5}
      />
      <Path
        d="M14.5 15a5.15 5.15 0 0 0-4.415-2.5h-.17A5.15 5.15 0 0 0 5.5 15"
        stroke="#fff"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Circle
        cx={10}
        cy={8}
        r={2}
        stroke="#fff"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Circle cx={10} cy={10} r={6.75} stroke="#4360DF" strokeWidth={1.5} />
      <Circle cx={10} cy={10} r={6.25} stroke="#4360DF" />
    </Svg>
  )
}
export default SvgContact
