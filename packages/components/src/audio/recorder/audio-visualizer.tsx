import { useCallback, useEffect, useRef } from 'react'

import { Stack } from '@tamagui/core'

interface Bar {
  x: number
  y: number
  height: number
  width: number
}

const DEFAULT_FFT_SIZE = 256
const TIME_OFF_SET = 80
const TIME_BETWEEN_BARS = 0.5
const BAR_WIDTH = 2

const drawBars = (ctx: CanvasRenderingContext2D, bars: Bar[]) => {
  bars.forEach((bar, index) => {
    ctx.fillStyle = `rgb(161, 171, 189)`
    ctx.fillRect(bar.x, bar.y, bar.width, bar.height)

    bar.x = bar.x - BAR_WIDTH / 1.5

    if (bar.x < 1) {
      bars.splice(index, 1)
    }
  })
}

function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const barsRef = useRef<Bar[]>([])
  const analyzerRef = useRef<AnalyserNode | null>(null)
  const lastBarTimeRef = useRef<number>(0)

  const draw = useCallback(() => {
    const now = Number(performance.now()) / TIME_OFF_SET
    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!ctx) return

    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight

    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.width = WIDTH + 'px'
    canvas.style.height = HEIGHT + 'px'

    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    const frequencyArray = new Float32Array(DEFAULT_FFT_SIZE)

    if (
      analyzerRef.current &&
      now > lastBarTimeRef.current + TIME_BETWEEN_BARS
    ) {
      analyzerRef.current.getFloatTimeDomainData(frequencyArray)

      let maxFreq = -Infinity

      maxFreq = Math.max(0.01, ...frequencyArray)

      const freq = Math.max(maxFreq, Math.floor(maxFreq * 128))

      barsRef.current.push({
        x: canvasRef.current.offsetWidth,
        y: canvasRef.current.offsetHeight / 2 - freq / 2,
        height: freq,
        width: BAR_WIDTH,
      })

      lastBarTimeRef.current = now
    }

    drawBars(ctx, barsRef.current)

    requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const AudioContext = window.AudioContext
      const audioContent = new AudioContext()
      const streamSource = audioContent.createMediaStreamSource(stream)

      const analyzer = audioContent.createAnalyser()
      streamSource.connect(analyzer)
      analyzer.fftSize = DEFAULT_FFT_SIZE

      barsRef.current = []
      analyzerRef.current = analyzer
    })
  }, [])

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
        style={{ overflowClipMargin: 'content-box', overflow: 'hidden' }}
      />
    </Stack>
  )
}

export { AudioVisualizer }
