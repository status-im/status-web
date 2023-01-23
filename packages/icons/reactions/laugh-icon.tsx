import { Circle, Defs, Path, RadialGradient, Stop, Svg } from 'react-native-svg'
import { useCurrentColor } from 'tamagui'

import type { SvgProps } from 'react-native-svg'

const SvgLaughIcon = (props: SvgProps) => {
  const { color: colorToken = 'currentColor', ...rest } = props
  const color = useCurrentColor(colorToken)
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={8} cy={8} r={8} fill="#FFD764" />
      <Circle cx={8} cy={8} r={8} fill="url(#laugh-icon_svg__a)" />
      <Path
        d="M12.5 9.75c0 2.21-2.5 3.75-4.5 3.75s-4.5-1.54-4.5-3.75c0-1 2.25-1.5 4.5-1.5s4.5.5 4.5 1.5Z"
        fill="#772622"
      />
      <Path
        d="M10.68 9.375C10.238 9.226 9.345 9 8 9s-2.239.226-2.68.375c-.18.06-.25.263-.166.434a.345.345 0 0 0 .309.191h5.074c.13 0 .25-.074.308-.191.086-.17.015-.374-.166-.434Z"
        fill="#fff"
      />
      <Path
        d="M9.472 11.886a.298.298 0 0 1-.022.535A3.403 3.403 0 0 1 8 12.75a3.403 3.403 0 0 1-1.45-.329.298.298 0 0 1-.022-.535A2.986 2.986 0 0 1 8 11.5c.535 0 1.037.14 1.472.386Z"
        fill="#E45852"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.101 4.657a.438.438 0 0 1 .617-.056l1.5 1.25a.438.438 0 0 1-.28.774c-.694 0-1.704.225-2.268.577a.438.438 0 0 1-.464-.742c.385-.24.89-.423 1.4-.543.103-.024.136-.156.055-.224l-.504-.42a.438.438 0 0 1-.056-.616ZM11.899 4.657a.437.437 0 0 0-.617-.056l-1.5 1.25a.438.438 0 0 0 .28.774c.694 0 1.705.225 2.269.577a.438.438 0 0 0 .463-.742c-.385-.24-.89-.423-1.4-.543-.103-.024-.136-.156-.055-.224l.503-.42a.438.438 0 0 0 .056-.616Z"
        fill="#424242"
      />
      <Defs>
        <RadialGradient
          id="laugh-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(124.563 4.521 4.45) scale(13.6611 17.7349)"
        >
          <Stop stopColor="#FFD764" />
          <Stop offset={1} stopColor="#FFB746" />
        </RadialGradient>
      </Defs>
    </Svg>
  )
}
export default SvgLaughIcon
