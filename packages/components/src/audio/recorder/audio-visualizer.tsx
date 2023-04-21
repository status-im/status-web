import { useCallback, useEffect, useRef } from 'react'

import { Stack } from '@tamagui/core'

type Bar = {
  x: number
  y: number
  height: number
  width: number
}

type Props = {
  width?: number
  height?: number
  analyser: AnalyserNode | null
}

const TIME_OFF_SET = 80
const TIME_BETWEEN_BARS = 0.6
const BAR_WIDTH = 2

// Our drawing bar function
const drawBars = (ctx: CanvasRenderingContext2D, bars: Bar[]) => {
  bars.forEach((bar, index) => {
    ctx.fillStyle = `rgb(161, 171, 189)`
    ctx.fillRect(bar.x, bar.y, bar.width, bar.height)

    // Move the bar to the left
    bar.x = bar.x - BAR_WIDTH / 2

    if (bar.x < 1) {
      bars.splice(index, 1)
    }
  })
}

const AudioVisualizer = (props: Props) => {
  const { width = '100%', height = 32, analyser } = props

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barsRef = useRef<Bar[]>([])
  const lastBarTimeRef = useRef<number>(0)

  // Main draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.height = height
    canvas.width = window.innerWidth

    // Get the frequency data from our analyser
    const frequencyArray = new Float32Array(256)
    const now = Number(performance.now()) / TIME_OFF_SET

    // we only want to draw one bar every TIME_BETWEEN_BARS seconds
    if (analyser && now > lastBarTimeRef.current + TIME_BETWEEN_BARS) {
      analyser.getFloatTimeDomainData(frequencyArray)

      let maxFreq = -Infinity

      maxFreq = Math.max(0.01, ...frequencyArray)

      const freq = Math.max(maxFreq, Math.floor(maxFreq * 128))

      // Add bar to our array
      barsRef.current.push({
        x: canvasRef.current.offsetWidth,
        y: canvasRef.current.offsetHeight / 2 - freq / 2,
        height: freq,
        width: BAR_WIDTH,
      })

      lastBarTimeRef.current = now
    }

    drawBars(ctx, barsRef.current)
    // Call again our draw function
    requestAnimationFrame(draw)
  }, [analyser, height])

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return (
    <Stack>
      <canvas
        ref={canvasRef}
        style={{
          overflowClipMargin: 'content-box',
          overflow: 'hidden',
          width,
          height,
        }}
      />
    </Stack>
  )
}

export { AudioVisualizer }
