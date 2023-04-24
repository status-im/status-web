import { useState } from 'react'

import { PauseIcon, PlayIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'

import { IconButton } from '../icon-button'
import { Player } from './recorder/player'

type AudioMessageProps = {
  url: string
}

const AudioMessage = (props: AudioMessageProps) => {
  const { url } = props

  const [isPlaying, setIsPlaying] = useState(false)

  const handleTooglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      borderRadius="$12"
      backgroundColor="$neutral-5"
      borderColor="$neutral-20"
      borderWidth={1}
      p={12}
      maxWidth={320}
    >
      <Stack pr={16}>
        {isPlaying ? (
          <IconButton
            icon={<PauseIcon size={20} color={'$white-100'} />}
            onPress={handleTooglePlayPause}
          />
        ) : (
          <IconButton
            icon={<PlayIcon size={20} color={'$white-100'} />}
            onPress={handleTooglePlayPause}
          />
        )}
      </Stack>
      <Player
        audio={url}
        isPlaying={isPlaying}
        onFinish={() => setIsPlaying(false)}
      />
    </Stack>
  )
}

export { AudioMessage }
