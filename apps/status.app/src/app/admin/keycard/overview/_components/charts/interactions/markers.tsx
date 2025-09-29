import { animated } from '@react-spring/web'
import { GlyphCircle } from '@visx/glyph'
import { Group } from '@visx/group'
import { Line } from '@visx/shape'

import { colors } from './chart'

import type { SpringValue } from '@react-spring/web'

type Props = {
  innerHeight: number
  circleSpringTotal: {
    x: SpringValue<number>
    y: SpringValue<number>
  }
  opacityAnimation: {
    opacity: SpringValue<number>
  }
}

const AnimatedCircle = animated(GlyphCircle)
const AnimatedLine = animated(Line)
const AnimatedGroup = animated(Group)

const Markers = (props: Props) => {
  const { innerHeight, circleSpringTotal, opacityAnimation } = props

  return (
    <>
      <AnimatedGroup
        top={0}
        left={circleSpringTotal.x}
        opacity={opacityAnimation.opacity}
      >
        <AnimatedLine
          from={{ x: 0, y: innerHeight }}
          to={{ x: 0, y: 0 }}
          stroke={colors.marker}
          strokeWidth={1}
          pointerEvents="none"
        />
      </AnimatedGroup>
      <AnimatedCircle
        size={90}
        top={circleSpringTotal.y}
        left={circleSpringTotal.x}
        strokeWidth={1}
        stroke={colors.background}
        fill={colors.marker}
        opacity={opacityAnimation.opacity}
      />
    </>
  )
}

export { Markers }
