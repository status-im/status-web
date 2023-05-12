import { config, useSpring } from '@react-spring/web'

import { getClosedIssues, getTotalIssues } from '../helpers/get-data'

import type { DayType } from '../chart'
import type { ScaleLinear, ScaleTime } from 'd3-scale'

type Props = {
  data: DayType[]
  yScale: ScaleLinear<number, number, never>
  xScale: ScaleTime<number, number, never>
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  innerHeight: number
  tooltipData: DayType & {
    completedIssuesPercentage: number
    openIssuesPercentage: number
    totalIssues: number
    openIssues: number
    closedIssues: number
    formattedDate: string
  }
}

/**
 * An custom hook that handles animations logic
 * @param data - the data to be used in the chart
 * @param margin - the margin of the chart
 * @param dates - the dates of the chart
 * @param innerHeight - the inner height of the chart
 * @param xScale - the xScale of the chart
 * @param yScale - the yScale of the chart
 * @param tooltipData - the data to be used in the tooltip


 * @returns circleSpringTotal - the spring animation for the total issues circle
 * @returns circleSpringClosed - the spring animation for the closed issues circle
 * @returns opacityAnimation - the spring animation for the some chart elements opacity
 * @returns tooltipAnimation - the spring animation for the tooltip
 * @returns drawingLineStyle - the spring animation for the drawing line style
 * @returns drawingGridColumns - the spring animation for the drawing grid columns
 * @returns clipPathAnimation - the spring animation for the clip path 
 **/

const useAnimations = (props: Props) => {
  const { data, margin, innerHeight, tooltipData, xScale, yScale } = props

  // Define spring for circle position
  const circleSpringTotal = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(getTotalIssues(tooltipData)),
    config: config.gentle,
  })

  const circleSpringClosed = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: yScale(getClosedIssues(tooltipData)),
    config: config.gentle,
  })

  const opacityAnimation = useSpring({
    opacity: data ? 1 : 0,
    config: config.gentle,
    delay: 200,
  })

  const tooltipAnimation = useSpring({
    x: xScale(new Date(tooltipData?.date)),
    y: innerHeight + margin.top + margin.bottom,
    config: config.gentle,
  })

  const [drawingLineStyle] = useSpring(() => ({
    from: { strokeDasharray: `${3000}, ${0}` },
    to: { strokeDasharray: `${0}, ${3000}` },
    reverse: true,
    config: { duration: 2000 },
  }))

  const [drawingGridColumns] = useSpring(() => ({
    from: { strokeDasharray: `0, 150` },
    to: { strokeDasharray: '4,2' },
    config: { duration: 250 },
  }))

  const [clipPathAnimation] = useSpring(() => ({
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0 0 0)' },
    config: { duration: 800 },
  }))

  return {
    circleSpringTotal,
    circleSpringClosed,
    opacityAnimation,
    tooltipAnimation,
    drawingLineStyle,
    drawingGridColumns,
    clipPathAnimation,
  }
}

export { useAnimations }
