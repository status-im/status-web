import { useEffect, useRef } from 'react'

import WaveSurfer from 'wavesurfer.js'

type Props = {
  audioBlob?: Blob
  isPlaying?: boolean
  onFinish?: () => void
}

export const Player = (props: Props) => {
  const { audioBlob, isPlaying, onFinish } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  // TODO - use theme tokens when dark mode is ready
  const progressColor = 'rgba(42, 121, 155, 1)'
  const waveColor = 'rgba(161, 171, 189, 1)'

  useEffect(() => {
    if (!containerRef.current) return

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 0,
      barGap: 4,
      height: 32,
      normalize: true,
      responsive: true,
      partialRender: true,
      mediaType: 'audio',
      backend: 'WebAudio',
    })
    waveSurferRef.current = waveSurfer
    waveSurferRef.current.on('finish', () => {
      onFinish?.()
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [containerRef, waveSurferRef, onFinish])

  useEffect(() => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)

      waveSurferRef.current?.load(audioUrl)
    } else {
      waveSurferRef.current?.empty()
    }
  }, [audioBlob, waveSurferRef])

  useEffect(() => {
    if (!audioBlob || !waveSurferRef.current) return

    if (isPlaying) {
      waveSurferRef.current.play()
    } else {
      waveSurferRef.current.pause()
    }
  }, [audioBlob, isPlaying])

  return (
    <div
      style={{
        flexGrow: 1,
        height: 32,
        width: '100%',
      }}
      ref={containerRef}
    />
  )
}
