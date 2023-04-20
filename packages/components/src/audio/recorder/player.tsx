import { useEffect, useRef, useState } from 'react'

import { AudioIcon, PauseIcon, PlayIcon, StopIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import WaveSurfer from 'wavesurfer.js'
import MicrophonePlugin from 'wavesurfer.js/src/plugin/microphone'

import { IconButton } from '../../icon-button'

export const Player = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [audioBlob, setAudioBlob] = useState<Blob>()

  const progressColor = 'rgba(42, 121, 155, 1)'
  const waveColor = 'rgba(42, 121, 155, 0.2)'

  useEffect(() => {
    if (!containerRef.current) return

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      cursorColor: '#4353FF',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 0,
      barGap: 4,
      height: 32,
      maxCanvasWidth: 400,
      normalize: true,
      responsive: true,
      partialRender: true,
      mediaType: 'audio',
      mediaControls: true,
      backend: 'WebAudio',
      plugins: [
        MicrophonePlugin.create({
          bufferSize: 4096,
          numberOfInputChannels: 1,
          numberOfOutputChannels: 1,
          constraints: {
            video: false,
            audio: true,
          },
        }),
      ],
    })
    waveSurferRef.current = waveSurfer

    waveSurfer.load('https://wavesurfer-js.org/example/media/demo.wav')
    waveSurfer.on('ready', () => {
      console.log("I'm ready!")
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [])

  const handleRecord = () => {
    if (waveSurferRef.current) {
      waveSurferRef.current.microphone.start()
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream)

        mediaRecorderRef.current = mediaRecorder

        let chunks: Blob[] = []
        console.log('stream: ', mediaRecorder.stream)
        mediaRecorder.addEventListener('dataavailable', event => {
          chunks.push(event.data)
        })

        setIsRecording(true)
        mediaRecorder.start()

        mediaRecorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
          setAudioBlob(blob)
          setIsRecording(false)
          chunks = []

          if (waveSurferRef.current) {
            waveSurferRef.current.empty()
            waveSurferRef.current.load(URL.createObjectURL(blob))
          }
        })

        setTimeout(() => {
          // Already stopped
          if (mediaRecorder.state === 'inactive') return
          mediaRecorder.stop()
          // Stops the recording after 2 minutes
        }, 120000)
      })
      .catch(err => {
        // Not allowed to record
        console.log('error: ', err)
      })
  }

  // useEffect(() => {
  //   if (audioBlob) {
  //     const audioUrl = URL.createObjectURL(audioBlob)

  //     waveSurferRef.current?.load(audioUrl)
  //   }
  // }, [audioBlob, waveSurferRef])

  useEffect(() => {
    if (waveSurferRef.current) {
      waveSurferRef.current.on('play', () => {
        setIsPlaying(true)
      })
      waveSurferRef.current.on('pause', () => {
        setIsPlaying(false)
      })
      waveSurferRef.current.on('finish', () => {
        setIsPlaying(false)
      })
    }
  }, [waveSurferRef])

  const handlePlay = () => {
    // setIsPlaying(true)
    waveSurferRef.current?.play()
  }

  const handleStopPlaying = () => {
    waveSurferRef.current?.pause()
    // setIsPlaying(false)
  }
  const handleStop = () => {
    setIsRecording(false)
    mediaRecorderRef.current?.stop()
  }

  console.log('wavesurfer: ', waveSurferRef.current)

  return (
    <Stack flexDirection="row" width="100%" gap={12}>
      <Stack flexGrow={0}>
        {isRecording ? (
          <IconButton icon={<StopIcon size={12} />} onPress={handleStop} />
        ) : (
          <>
            {isPlaying ? (
              <IconButton
                icon={<PauseIcon size={12} />}
                onPress={handleStopPlaying}
              />
            ) : (
              <IconButton
                icon={<PlayIcon size={12} />}
                onPress={handlePlay}
                // disabled={!audioBlob}
              />
            )}
            <IconButton
              icon={<AudioIcon size={12} />}
              onPress={handleRecord}
              disabled={isRecording}
            />
          </>
        )}
      </Stack>
      <div
        style={{
          flexGrow: 1,
          height: 32,
        }}
        ref={containerRef}
      />
    </Stack>
  )
}
