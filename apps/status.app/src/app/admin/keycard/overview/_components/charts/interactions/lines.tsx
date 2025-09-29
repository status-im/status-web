import { useState } from 'react'

import {
  animated,
  config,
  useIsomorphicLayoutEffect,
  useSpring,
} from '@react-spring/web'
import { curveLinear } from '@visx/curve'
import { LinearGradient } from '@visx/gradient'
import { GridColumns } from '@visx/grid'
import { AreaClosed, LinePath } from '@visx/shape'

import { colors } from './chart'

import type { VisibleInteractionsType } from './chart'
import type { ScaleLinear, ScaleTime } from 'd3-scale'

type Datum = {
  date: Date
  value: number
}

type Props = {
  yScale: ScaleLinear<number, number, never>
  xScale: ScaleTime<number, number, never>
  innerHeight: number
  numTicksX: number
  visibleInteractions: VisibleInteractionsType[]
  total: Datum[]
  verifications: Datum[]
  firmware: Datum[]
  databases: Datum[]
}

const AnimatedAreaClosed = animated(AreaClosed)
const AnimatedLinePath = animated(LinePath)

const Lines = (props: Props) => {
  const {
    total,
    xScale,
    yScale,
    innerHeight,
    numTicksX,
    databases,
    firmware,
    verifications,
    visibleInteractions,
  } = props

  const interactions = {
    total,
    databases,
    firmware,
    verifications,
  }

  const [clipPathAnimation, api] = useSpring(() => ({}))
  const [drawingLineStyle, apiLine] = useSpring(() => ({}))

  const [opacity, setOpacity] = useState(0)

  useIsomorphicLayoutEffect(() => {
    api.start({
      from: { clipPath: 'inset(0 100% 0 0)' },
      to: { clipPath: 'inset(0 0 0 0)' },
      config: { ...config.slow },
      delay: 300,
    })
  }, [])

  const [drawingGridColumns, apiCols] = useSpring(() => ({}))

  useIsomorphicLayoutEffect(() => {
    apiCols.start({
      from: { strokeDasharray: '0, 150' },
      to: { strokeDasharray: '4,2' },
      config: { ...config.slow },
      delay: 300,
    })
  }, [])

  // When the component mounts, animate the drawing line otherwise the animation will not be triggered
  useIsomorphicLayoutEffect(() => {
    apiLine.start({
      from: {
        strokeDasharray: '3000, 0',
      },
      to: {
        strokeDasharray: '0, 3000',
      },
      reverse: true,
      config: { ...config.slow, duration: 3000 },
      delay: 300,
    })
  }, [])

  useIsomorphicLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setOpacity(1)
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <g className="relative transition-opacity ease-in" opacity={opacity}>
      <LinearGradient
        id="gradient"
        from={colors.total}
        to={colors.background}
        fromOpacity={0.3}
        toOpacity={0}
      />
      {visibleInteractions.find(interaction => interaction === 'total') && (
        <AnimatedAreaClosed
          data={total}
          x={d => {
            const datum = d as Datum
            return xScale(datum.date)
          }}
          y={d => {
            const datum = d as Datum
            return yScale(datum.value)
          }}
          yScale={yScale}
          fill="url(#gradient)"
          curve={curveLinear}
          style={clipPathAnimation}
        />
      )}
      <GridColumns
        scale={xScale}
        height={innerHeight}
        style={drawingGridColumns}
        numTicks={numTicksX}
        strokeDasharray="2,2"
      />
      <LinearGradient
        id="gradient-columns"
        from={'rgba(255, 255, 255, 1)'}
        to={'rgba(255, 255, 255, 0)'}
        fromOpacity={1}
        toOpacity={0}
      />
      <rect
        x={0}
        y={0}
        width="90%"
        height={innerHeight}
        fill="url(#gradient-columns)"
      />
      {/* Drawing lines */}
      {visibleInteractions.map(interaction => {
        return (
          <AnimatedLinePath
            key={interaction}
            data={interactions[interaction]}
            x={d => {
              const datum = d as Datum
              return xScale(datum.date)
            }}
            y={d => {
              const datum = d as Datum
              return yScale(datum.value)
            }}
            stroke={colors[interaction]}
            strokeWidth={2}
            curve={curveLinear}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={drawingLineStyle}
          />
        )
      })}
    </g>
  )
}

export { Lines }
