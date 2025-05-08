import { animated } from '@react-spring/web'
import { GlyphCircle } from '@visx/glyph'
import { Group } from '@visx/group'
import { Line } from '@visx/shape'

import { colors } from './constants'

import type { SpringValue } from '@react-spring/web'

type Props = {
  innerHeight: number
  circleSpringPrice: {
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

const Marker = (props: Props) => {
  const { innerHeight, circleSpringPrice, opacityAnimation } = props

  return (
    <>
      <AnimatedGroup
        top={0}
        left={circleSpringPrice.x}
        opacity={opacityAnimation.opacity}
      >
        <AnimatedLine
          from={{ x: 0, y: innerHeight }}
          to={{ x: 0, y: 0 }}
          stroke={colors.white}
          strokeWidth={3}
          pointerEvents="none"
        />
        <AnimatedLine
          from={{ x: 0, y: innerHeight }}
          to={{ x: 0, y: 0 }}
          stroke={colors.line}
          strokeWidth={1}
          pointerEvents="none"
        />
      </AnimatedGroup>
      <AnimatedCircle
        size={90}
        top={circleSpringPrice.y}
        left={circleSpringPrice.x}
        strokeWidth={1}
        stroke={colors.background}
        fill={colors.line}
        opacity={opacityAnimation.opacity}
      />
    </>
  )
}

export { Marker }
