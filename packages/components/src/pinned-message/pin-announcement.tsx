import { PinIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'

import { Text } from '../text'

import type { MessageProps } from '../messages'

type Props = {
  message: MessageProps
  name: string
}

const PinAnnouncement = (props: Props) => {
  const { message, name } = props

  return (
    <Stack flexDirection="row">
      <PinIcon />
      <Stack flexDirection="column">
        <Text size={13}>{`<strong>{name}</strong> pinned a message`}</Text>
        09:30
        <Text size={11}>{message.text}</Text>
      </Stack>
    </Stack>
  )
}

export { PinAnnouncement }
export type { Props as PinAnnouncementProps }
