import { useEffect } from 'react'

import { AudioIcon, PauseIcon, PlayIcon, TrashIcon } from '@status-im/icons'
import { Stack, styled } from '@tamagui/core'

import { useAudioRecorder } from '../../../hooks'
import { IconButton } from '../../icon-button'
import { Text } from '../../text'
import { AudioVisualizer } from '../audio-visualizer/audio-visualizer'
import { Player } from './../player/player'
import { CaptureButton } from './components/capture-button'

const getSeconds = (s: number): number => s % 60
const getMinutes = (s: number): number => Math.floor((s % 3600) / 60)
const getHours = (s: number): number => Math.floor(s / 3600)

const pad = (n: number): string => n.toString().padStart(2, '0')

const TIMEOUT = 120 // seconds

export function formatTimer(seconds: number): string {
  const s: number = getSeconds(seconds)
  const m: number = getMinutes(seconds)
  const h: number = getHours(seconds)

  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

const Recorder = () => {
  const {
    analyser,
    deleteRecording,
    startRecording,
    stopRecording,
    isPlaying,
    tooglePlayPause,
    isRecording,
    recordingTime,
    audioBlob,
  } = useAudioRecorder()

  // Stop recording if recording time exceeds TIMEOUT value
  useEffect(() => {
    if (recordingTime > TIMEOUT) {
      return stopRecording()
    }
  }, [recordingTime, stopRecording])

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent={isRecording || audioBlob ? 'space-between' : 'flex-end'}
      height={56}
    >
      {audioBlob && !isRecording && (
        <Stack flexDirection="row" alignItems="center" flexGrow={1}>
          <Stack mr={16}>
            {isPlaying ? (
              <IconButton
                icon={<PauseIcon size={20} />}
                onPress={tooglePlayPause}
              />
            ) : (
              <IconButton
                icon={<PlayIcon size={20} />}
                onPress={tooglePlayPause}
              />
            )}
          </Stack>
          <Stack pr={20} flexGrow={1}>
            <Player
              audio={audioBlob}
              isPlaying={isPlaying}
              onFinish={tooglePlayPause}
            />
          </Stack>
        </Stack>
      )}
      {isRecording && (
        <Stack
          flexDirection="row"
          alignItems="center"
          width="100%"
          flexShrink={1}
          gap={4}
        >
          <RecordingDot />
          <Text weight="semibold" size={11}>
            {formatTimer(recordingTime)}
          </Text>
          <Stack flexGrow={1} width="100%" pl={20}>
            <AudioVisualizer analyser={analyser} />
          </Stack>
        </Stack>
      )}
      {!isRecording && recordingTime === 0 && !audioBlob && (
        <IconButton icon={<AudioIcon size={20} />} onPress={startRecording} />
      )}
      <Stack flexDirection="row" alignItems="center" justifyContent="flex-end">
        {(isRecording || audioBlob) && (
          <IconButton
            icon={<TrashIcon size={20} color="$danger-50" />}
            onPress={deleteRecording}
          />
        )}
        {(isRecording || audioBlob) && (
          <Stack justifyContent="center" alignItems="center" ml={20}>
            <CaptureButton
              onPress={isRecording ? stopRecording : startRecording}
              isRecording={isRecording}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export { Recorder }

const RecordingDot = styled(Stack, {
  backgroundColor: '$danger-50',
  borderRadius: '$full',
  height: 8,
  width: 8,
  mr: 4,
})
