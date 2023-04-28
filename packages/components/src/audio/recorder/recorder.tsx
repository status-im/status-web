import { useEffect, useState } from 'react'

import { ArrowTopIcon, AudioIcon, TrashIcon } from '@status-im/icons'
import { Stack, styled } from '@tamagui/core'

import { useAudioRecorder } from '../../../hooks'
import { formatTimer } from '../../../utils'
import { Button } from '../../button'
import { IconButton } from '../../icon-button'
import { Text } from '../../text'
import { AudioVisualizer } from '../audio-visualizer/audio-visualizer'
import { Player } from './../player/player'
import { CaptureButton } from './components/capture-button'

const TIMEOUT = 120 // seconds

type Props = {
  onRecordingStart?: () => void
  onDeletingRecording?: () => void
  onSendRecording?: (audio: Blob) => void
}

const Recorder = (props: Props) => {
  const { onRecordingStart, onDeletingRecording, onSendRecording } = props

  const [shouldSendRecording, setShouldSendRecording] = useState<boolean>(false)
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

  useEffect(() => {
    if (audioBlob && shouldSendRecording) {
      onSendRecording?.(audioBlob)
      deleteRecording()
      setShouldSendRecording(false)
    }
  }, [audioBlob, deleteRecording, onSendRecording, shouldSendRecording])

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      justifyContent={isRecording || audioBlob ? 'space-between' : 'flex-end'}
      height={56}
      width="100%"
      flex={1}
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
        <Button
          variant="outline"
          icon={<AudioIcon size={20} />}
          size={32}
          onPress={() => {
            startRecording()
            onRecordingStart?.()
          }}
        />
      )}
      {(isRecording || audioBlob) && (
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          flexShrink={1}
          width={120}
        >
          <Stack
            flexDirection="row"
            alignItems="flex-end"
            justifyContent="flex-start"
            height={96}
            width={120}
            overflow="hidden"
            position="absolute"
            bottom={-28}
            right={-16}
          >
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack pr={16}>
                <IconButton
                  circular
                  variant="danger"
                  overrideColor="$white-100"
                  icon={<TrashIcon size={20} />}
                  onPress={() => {
                    deleteRecording()
                    onDeletingRecording?.()
                  }}
                />
              </Stack>
              <CaptureButton
                onPress={isRecording ? stopRecording : startRecording}
                isRecording={isRecording}
              />
            </Stack>
          </Stack>
          <Stack position="absolute" bottom={56} right={0}>
            {/* TODO fix variant to receive the community color option */}
            <IconButton
              circular
              variant="default"
              icon={<ArrowTopIcon size={20} />}
              onPress={() => {
                stopRecording()
                setShouldSendRecording(true)
              }}
            />
          </Stack>
        </Stack>
      )}
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
