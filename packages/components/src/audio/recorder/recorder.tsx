import { useEffect } from 'react'

import { AudioIcon, TrashIcon } from '@status-im/icons'
import { Stack, styled } from '@tamagui/core'

import { useAudioRecorder } from '../../../hooks'
import { formatTimer } from '../../../utils'
import { IconButton } from '../../icon-button'
import { Text } from '../../text'
import { AudioVisualizer } from '../audio-visualizer/audio-visualizer'
import { Player } from './../player/player'
import { CaptureButton } from './components/capture-button'

const TIMEOUT = 120 // seconds

const Recorder = () => {
  const {
    analyser,
    deleteRecording,
    startRecording,
    stopRecording,
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
          <Stack pr={20} flexGrow={1}>
            <Player audio={audioBlob} />
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
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        flexShrink={1}
      >
        {(isRecording || audioBlob) && (
          <IconButton
            circular
            variant="danger"
            overrideColor="$white-100"
            icon={<TrashIcon size={20} />}
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
