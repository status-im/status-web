import { PinIcon } from '@status-im/icons/16'
import { Stack } from '@tamagui/core'

import { Avatar, IconAvatar } from '../avatar'
import { Text } from '../text'

import type { MessageProps } from '../messages'

type Props = {
  message: MessageProps
  name: string
}

const PinAnnouncement = (props: Props) => {
  const { message, name } = props

  return (
    <Stack flexDirection="row" space={8} padding={8}>
      <IconAvatar backgroundColor="$turquoise-50-opa-5" color="$neutral-100">
        <PinIcon />
      </IconAvatar>
      <Stack flexDirection="column" space={2}>
        <Stack flexDirection="row" space={4} alignItems="center">
          <Text size={13} weight="semibold">
            {name}
          </Text>
          <Text size={13}>pinned a message</Text>
          <Text size={11} color="$neutral-50">
            09:30
          </Text>
        </Stack>
        <Stack flexDirection="row" space={4}>
          <Avatar
            size={16}
            src="https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500"
          />
          <Text size={11} weight="semibold">
            Alisher Yakupov
          </Text>
          <Text size={11}>{message.text}</Text>
        </Stack>
      </Stack>
    </Stack>
  )
}

export { PinAnnouncement }
export type { Props as PinAnnouncementProps }
