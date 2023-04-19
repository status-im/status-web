// import { useEffect, useRef, useState } from 'react'

// import { AudioIcon, PauseIcon, PlayIcon, StopIcon } from '@status-im/icons'
// import { Stack } from '@tamagui/core'
// import WaveSurfer from 'wavesurfer.js'
// import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone'

// import { IconButton } from '../../icon-button'

// export const Recorder = () => {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const waveSurferRef = useRef<WaveSurfer | null>(null)
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const [isRecording, setIsRecording] = useState<boolean>(false)
//   const [isPlaying, setIsPlaying] = useState<boolean>(false)
//   const [audioBlob, setAudioBlob] = useState<Blob>()

//   const progressColor = 'rgba(42, 121, 155, 1)'
//   const waveColor = 'rgba(42, 121, 155, 0.2)'

//   useEffect(() => {
//     if (!containerRef.current) return

//     const waveSurfer = WaveSurfer.create({
//       container: containerRef.current,
//       waveColor,
//       progressColor,
//       cursorColor: '#4353FF',
//       barWidth: 2,
//       barRadius: 3,
//       cursorWidth: 0,
//       barGap: 4,
//       height: 32,
//       maxCanvasWidth: 400,
//       normalize: true,
//       responsive: true,
//       partialRender: true,
//       mediaType: 'audio',
//       mediaControls: true,
//       backend: 'WebAudio',
//       plugins: [
//         MicrophonePlugin.create({
//           bufferSize: 4096,
//           numberOfInputChannels: 1,
//           numberOfOutputChannels: 1,
//           constraints: {
//             video: false,
//             audio: true,
//           },
//         }),
//       ],
//     })
//     waveSurferRef.current = waveSurfer

//     waveSurfer.load('https://wavesurfer-js.org/example/media/demo.wav')
//     waveSurfer.on('ready', () => {
//       console.log("I'm ready!")
//     })

//     return () => {
//       waveSurfer.destroy()
//     }
//   }, [])

//   const handleRecord = () => {
//     if (waveSurferRef.current) {
//       waveSurferRef.current.microphone.start()
//     }
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then(stream => {
//         const mediaRecorder = new MediaRecorder(stream)

//         mediaRecorderRef.current = mediaRecorder

//         let chunks: Blob[] = []
//         console.log('stream: ', mediaRecorder.stream)
//         mediaRecorder.addEventListener('dataavailable', event => {
//           chunks.push(event.data)
//           console.log("here's the data: ", event.data)
//         })

//         setIsRecording(true)
//         mediaRecorder.start()

//         mediaRecorder.addEventListener('stop', () => {
//           clearInterval(intervalId)

//           const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
//           setAudioBlob(blob)
//           setIsRecording(false)
//           chunks = []

//           if (waveSurferRef.current) {
//             waveSurferRef.current.empty()
//             waveSurferRef.current.load(URL.createObjectURL(blob))
//           }
//         })

//         setTimeout(() => {
//           // Already stopped
//           if (mediaRecorder.state === 'inactive') return
//           mediaRecorder.stop()
//           // Stops the recording after 2 minutes
//         }, 120000)
//       })
//       .catch(err => {
//         // Not allowed to record
//         console.log('error: ', err)
//       })
//   }

//   useEffect(() => {
//     if (!waveSurferRef.current) return
//     let mediaRecorder: MediaRecorder
//     const audioChunks: Blob[] = []
//     waveSurferRef.current.microphone.on('deviceReady', function (stream) {
//       console.info('Device ready!')
//       mediaRecorder = new MediaRecorder(stream)
//       mediaRecorder.start()
//       mediaRecorder.addEventListener('dataavailable', event => {
//         audioChunks.push(event.data)
//       })

//       mediaRecorder.addEventListener('stop', () => {
//         const audioBlob = new Blob(audioChunks)
//         const audioUrl = URL.createObjectURL(audioBlob)
//         const audio = new Audio(audioUrl)
//         audio.play()
//       })
//     })
//   }, [waveSurferRef])

//   useEffect(() => {
//     if (audioBlob) {
//       const audioUrl = URL.createObjectURL(audioBlob)

//       waveSurferRef.current?.load(audioUrl)
//     }
//   }, [audioBlob, waveSurferRef])

//   useEffect(() => {
//     if (waveSurferRef.current) {
//       waveSurferRef.current.on('play', () => {
//         setIsPlaying(true)
//       })
//       waveSurferRef.current.on('pause', () => {
//         setIsPlaying(false)
//       })
//       waveSurferRef.current.on('finish', () => {
//         setIsPlaying(false)
//       })
//     }
//   }, [waveSurferRef])

//   const handlePlay = () => {
//     // setIsPlaying(true)
//     waveSurferRef.current?.play()
//   }

//   const handleStopPlaying = () => {
//     waveSurferRef.current?.pause()
//     // setIsPlaying(false)
//   }
//   const handleStop = () => {
//     setIsRecording(false)
//     mediaRecorderRef.current?.stop()
//   }

//   return (
//     <Stack flexDirection="row" width="100%" gap={12}>
//       <Stack flexGrow={0}>
//         {isRecording ? (
//           <IconButton icon={<StopIcon size={12} />} onPress={handleStop} />
//         ) : (
//           <>
//             {isPlaying ? (
//               <IconButton
//                 icon={<PauseIcon size={12} />}
//                 onPress={handleStopPlaying}
//               />
//             ) : (
//               <IconButton
//                 icon={<PlayIcon size={12} />}
//                 onPress={handlePlay}
//                 // disabled={!audioBlob}
//               />
//             )}
//             <IconButton
//               icon={<AudioIcon size={12} />}
//               // onPress={handleRecord}
//               disabled={isRecording}
//             />
//           </>
//         )}
//       </Stack>
//       <div
//         style={{
//           flexGrow: 1,
//           height: 32,
//         }}
//         ref={containerRef}
//       />
//     </Stack>
//   )
// }

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

  useEffect(() => {
    let animationFrameId: number | null = null
    console.log('canvasRef.current: ', canvasRef.current)
    console.log('analyserRef.current: ', analyserRef.current)

    if (canvasRef.current && analiserData) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) return
      const WIDTH = window.innerWidth * 0.5
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
  }, [canvasRef, analyserRef, analiserData, isRecording])

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
