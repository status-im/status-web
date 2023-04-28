import { useEffect, useRef, useState } from 'react'

import { PauseIcon, PlayIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import WaveSurfer from 'wavesurfer.js'

import { formatTimer } from '../../../utils'
import { IconButton } from '../../icon-button'
import { WaveformSkeleton } from '../../skeleton'
import { Text } from '../../text'

type Props = {
  audio?: Blob | string
  variant?: 'remaining-time' | 'progress'
  hasLoader?: boolean
}

export const Player = (props: Props) => {
  const { audio, variant = 'progress', hasLoader } = props

  const containerRef = useRef<HTMLDivElement>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // TODO - use theme tokens when dark mode is ready. Also the color for the UI should come for the community color selection
  const progressColor = 'rgba(42, 121, 155, 1)'
  const waveColor = 'rgba(161, 171, 189, 1)'

  const isProgress = variant === 'progress'
  const isRemainingTime = variant === 'remaining-time'

  const isPaused = !isPlaying && !isLoading

  useEffect(() => {
    if (!containerRef.current) return

    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor,
      progressColor,
      barWidth: 2,
      barRadius: 3,
      barMinHeight: 1,
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

    waveSurferRef.current.on('ready', () => {
      setIsLoading(false)
    })

    waveSurferRef.current.on('audioprocess', () => {
      setRemainingTime(waveSurfer.getDuration() - waveSurfer.getCurrentTime())
    })

    waveSurferRef.current.on('play', () => {
      setIsPlaying(true)
    })

    waveSurferRef.current.on('pause', () => {
      setIsPlaying(false)
    })

    waveSurferRef.current.on('finish', () => {
      setIsPlaying(false)
      waveSurfer.seekTo(0)
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [containerRef, waveSurferRef])

  useEffect(() => {
    if (audio) {
      if (typeof audio === 'string') {
        waveSurferRef.current?.load(audio)
      } else {
        const audioUrl = URL.createObjectURL(audio)

        waveSurferRef.current?.load(audioUrl)
      }
    } else {
      waveSurferRef.current?.empty()
    }
  }, [audio, waveSurferRef])

  useEffect(() => {
    waveSurferRef.current?.drawBuffer()
  }, [waveSurferRef, isLoading])

  return (
    <Stack flex={1} flexDirection="row" alignItems="center" width="100%">
      {isLoading && hasLoader && (
        <Stack position="absolute" top={0} left={0} width="70%">
          <WaveformSkeleton />
        </Stack>
      )}
      <Stack pr={12}>
        {isPlaying && (
          <IconButton
            circular
            icon={<PauseIcon size={20} color={'$white-100'} />}
            onPress={() => waveSurferRef.current?.pause()}
          />
        )}

        {isPaused && (
          <IconButton
            circular
            icon={<PlayIcon size={20} color={'$white-100'} />}
            onPress={() => waveSurferRef.current?.play()}
          />
        )}
      </Stack>
      {isProgress && (
        <Stack px={12} width={62}>
          <Text size={13} weight="medium">
            {formatTimer(
              Math.round(waveSurferRef.current?.getCurrentTime() || 0)
            )}
          </Text>
        </Stack>
      )}

      <div
        style={{
          flexGrow: 1,
          height: 32,
          width: '100%',
          opacity: isLoading ? 0 : 1,
        }}
        ref={containerRef}
      />
      {isRemainingTime && !isLoading && (
        <Stack width={54} pl={16}>
          <Text size={13} weight="medium">
            {formatTimer(Math.round(remainingTime))}
          </Text>
        </Stack>
      )}
    </Stack>
  )
}
