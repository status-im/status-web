import { animated, config, useSpring } from '@react-spring/web'
import { curveCatmullRom } from '@visx/curve'
import { AreaClosed, LinePath } from '@visx/shape'

import { negativeColors, positiveColors } from '../constants'
import { formatChartValue } from '../utils'

import type { BaseChartProps, ChartDatum } from '../utils'
import type { ScaleLinear, ScaleTime } from 'd3-scale'

type Props = BaseChartProps & {
  yScale: ScaleLinear<number, number, never>
  xScale: ScaleTime<number, number, never>
  pricesData: ChartDatum[]
  currency?: string
}

const AnimatedAreaClosed = animated(AreaClosed)
const AnimatedLinePath = animated(LinePath)

// Tag dimensions constants
const MIN_TAG_WIDTH = 40 // Minimum width of the tag
const TAG_HORIZONTAL_PADDING = 16 // Total horizontal padding (left + right)
const TAG_BASE_OFFSET = 20 // Base offset from tag center point
const FONT_SIZE = 12 // Font size used for the tag text
const CHAR_WIDTH = 7 // Approximate width per character for fontSize 12

// Cache for canvas context to avoid recreating it
let canvasContext: CanvasRenderingContext2D | null = null

/**
 * Get or create a canvas context for measuring text width
 */
function getCanvasContext(): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null
  if (!canvasContext) {
    const canvas = document.createElement('canvas')
    canvasContext = canvas.getContext('2d')
    if (canvasContext) {
      // Match the font used in SVG (system default sans-serif, 12px)
      canvasContext.font = `${FONT_SIZE}px sans-serif`
    }
  }
  return canvasContext
}
function measureTextWidth(text: string): number {
  const context = getCanvasContext()
  if (context) {
    return context.measureText(text).width
  }
  return text.length * CHAR_WIDTH
}

const Content = (props: Props) => {
  const {
    pricesData,
    xScale,
    yScale,
    isPositive = true,
    dataType = 'price',
  } = props

  const colors = isPositive ? positiveColors : negativeColors
  const lastData = pricesData[pricesData.length - 1]

  const animation = useSpring({
    from: { opacity: 0, progress: 0 },
    to: { opacity: 1, progress: 1 },
    config: config.gentle,
  })

  if (!pricesData.length) return null

  const tagX = xScale(lastData.date)
  const tagY = yScale(lastData.value)
  const formattedValue = formatChartValue(lastData.value, dataType)

  // Calculate width based on actual measured text width, accounting for proportional fonts
  // This handles currency symbols, decimal points, and commas correctly
  const textWidth = measureTextWidth(formattedValue)
  const tagWidth = Math.max(MIN_TAG_WIDTH, textWidth + TAG_HORIZONTAL_PADDING)
  const tagXOffset = Math.max(0, TAG_BASE_OFFSET - tagWidth / 2)
  const textX = tagXOffset + tagWidth / 2

  return (
    <g>
      <AnimatedAreaClosed
        data={pricesData}
        x={d => xScale((d as ChartDatum).date)}
        y={d => yScale((d as ChartDatum).value)}
        yScale={yScale}
        fill={colors.fill}
        curve={curveCatmullRom}
        style={{
          opacity: animation.opacity,
          clipPath: animation.progress.to(
            p => `inset(0 ${100 - p * 100}% 0 0)`,
          ),
        }}
      />

      <AnimatedLinePath
        data={pricesData}
        x={d => xScale((d as ChartDatum).date)}
        y={() => yScale(lastData.value)}
        stroke={colors.marker}
        strokeWidth={2}
        strokeDasharray="0.2 4"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ opacity: animation.opacity }}
      />

      <AnimatedLinePath
        data={pricesData}
        x={d => xScale((d as ChartDatum).date)}
        y={d => yScale((d as ChartDatum).value)}
        stroke={colors.line}
        strokeWidth={2}
        curve={curveCatmullRom}
        shapeRendering="geometricPrecision"
        style={{
          strokeDasharray: animation.progress.to(
            p => `${p * 3000}, ${3000 - p * 3000}`,
          ),
        }}
      />

      <g transform={`translate(${tagX}, ${tagY})`}>
        <rect
          x={tagXOffset}
          y={-10}
          width={tagWidth}
          height={20}
          fill={colors.line}
          rx={6}
        />
        <text
          x={textX}
          y={5}
          fill={colors.white}
          fontSize={12}
          textAnchor="middle"
        >
          {formattedValue}
        </text>
      </g>
    </g>
  )
}

export { Content }
