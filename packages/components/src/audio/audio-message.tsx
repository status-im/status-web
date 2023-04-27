import { Stack } from '@tamagui/core'

import { Player } from './player/player'

type AudioMessageProps = {
  url: string | Blob
}

const AudioMessage = (props: AudioMessageProps) => {
  const { url } = props

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
      <Player audio={url} variant="remaining-time" />
    </Stack>
  )
}

export { AudioMessage }
