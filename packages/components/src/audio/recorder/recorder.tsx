// import { VoiceRecorder } from 'react-voice-recorder-player'

// export function Recorder() {
//   const styles = {
//     mainContainerStyle: {
//       backgroundColor: 'gray',
//       border: '1px solid black',
//       borderRadius: '5px',
//       padding: '10px',
//     },
//     controllerContainerStyle: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       marginTop: '10px',
//     },
//     controllerStyle: {
//       backgroundColor: 'white',
//       border: '1px solid black',
//       borderRadius: '5px',
//       cursor: 'pointer',
//       padding: '5px',
//     },
//     waveContainerStyle: {
//       height: '100px',
//       marginTop: '10px',
//       width: '100%',
//     },
//   }

//   return (
//     <VoiceRecorder
//       mainContainerStyle={styles.mainContainerStyle}
//       controllerContainerStyle={styles.controllerContainerStyle}
//       controllerStyle={styles.controllerStyle}
//       waveContainerStyle={styles.waveContainerStyle}
//     />
//   )
// }

import { useEffect, useRef, useState } from 'react'

import { Stack } from '@tamagui/core'
import { useWindowDimensions } from 'tamagui'

interface Bar {
  x: number
  y: number
  height: number
  width: number
}

const timeOffset = 20
const performance = window.performance || Date

export const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [analiserData, setAnaliserData] = useState<AnalyserNode | null>(null)
  const frequencyArrayRef = useRef<Float32Array | null>(null)
  const barsRef = useRef<Bar[]>([])

  const dimensions = useWindowDimensions()

  useEffect(() => {
    let animationFrameId: number | null = null

    if (canvasRef.current && analiserData) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) return
      const WIDTH = dimensions.width
      const HEIGHT = 96

      canvas.width = WIDTH
      canvas.height = HEIGHT
      canvas.style.width = WIDTH + 'px'
      canvas.style.height = HEIGHT + 'px'
      // ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      // ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)

      const draw = () => {
        animationFrameId = requestAnimationFrame(draw)

        let max = 0
        const now = performance.now() / timeOffset

        ctx!.fillStyle = 'rgb(0, 0, 0)'
        ctx!.fillRect(0, 0, WIDTH, HEIGHT)
        if (!frequencyArrayRef.current) return

        if (performance.now() / timeOffset > now) {
          frequencyArrayRef.current &&
            analiserData!.getFloatTimeDomainData(frequencyArrayRef.current)
          for (let i = 0; i < frequencyArrayRef.current.length; i++) {
            if (frequencyArrayRef.current[i] > max) {
              max = frequencyArrayRef.current[i]
            }
          }

          const freq = Math.floor(max * 440)

          barsRef.current.push({
            x: canvas.width,
            y: canvas.height / 2 - freq / 2,
            height: freq,
            width: 8,
          })
        }

        barsRef.current.forEach((bar, index) => {
          ctx!.fillStyle = `rgb(161, 171, 189)`
          ctx!.fillRect(bar.x, bar.y, bar.width, bar.height)
          bar.x = bar.x - 2

          if (bar.x < 1) {
            barsRef.current.splice(index, 1)
          }
        })
      }
      if (isRecording) {
        draw()
      }
    }

    return () => {
      cancelAnimationFrame(animationFrameId!)
    }
  }, [canvasRef, analyserRef, analiserData, isRecording, dimensions.width])

  const handleStartRecording = () => {
    setIsRecording(true)

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        const audioChunks: BlobPart[] = []

        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data)
        })

        mediaRecorder.addEventListener('stop', () => {
          // const audioBlob = new Blob(audioChunks)
          // const audioUrl = URL.createObjectURL(audioBlob)

          setAudioChunks(audioChunks)
          setIsRecording(false)
        })

        mediaRecorder.start()

        const audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()

        analyser.fftSize = 512

        source.connect(analyser)
        analyser.connect(audioContext.destination)
        frequencyArrayRef.current = new Float32Array(analyser.fftSize)

        audioContextRef.current = audioContext
        setAnaliserData(analyser)
        // analyserRef.current = analyser
      })
      .catch(error => {
        console.error(error)
      })
  }

  const handleStopRecording = () => {
    setIsRecording(false)

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    if (barsRef.current) {
      barsRef.current = []
    }
  }

  return (
    <Stack>
      <canvas ref={canvasRef} />
      <button
        onClick={handleStartRecording}
        disabled={isRecording}
        style={{ color: 'black' }}
      >
        Start Recording
      </button>
      <button
        onClick={handleStopRecording}
        disabled={!isRecording}
        style={{ color: 'black' }}
      >
        Stop Recording
      </button>
    </Stack>
  )
}
