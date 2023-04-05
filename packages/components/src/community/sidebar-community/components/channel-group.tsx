import * as Accordion from '@radix-ui/react-accordion'
import { Stack } from 'tamagui'

import { Channel } from '../../../channel'
import { DividerLabel } from '../../../dividers'

import type { ChannelType } from '../../mock-data'

type Props = {
  name: string
  channels: ChannelType[]
  unreadCount?: number
  selectedChannelId?: string
  expanded: boolean
}

const ChannelGroup = (props: Props) => {
  const { name, channels, selectedChannelId, expanded } = props

  const totalMentionsCount = channels.reduce(
    (acc, channel) => acc + (channel.mentionCount || 0),
    0
  )

  return (
    <Accordion.Item value={name}>
      <Stack>
        <Accordion.Trigger>
          <DividerLabel
            type="expandable"
            expanded={expanded}
            label={name}
            counterType="default"
            count={
              totalMentionsCount > 0 && expanded === false
                ? totalMentionsCount
                : undefined
            }
          />
        </Accordion.Trigger>

        <Stack paddingHorizontal={8} paddingBottom={expanded ? 8 : 0}>
          {channels.map(channel => {
            const {
              emoji,
              title,
              //This will work differently with the live data
              channelStatus: type = 'default',
              mentionCount = 0,
            } = channel

            const selected = selectedChannelId === channel.id

            return (
              <Accordion.Content key={channel.title}>
                <Channel
                  emoji={emoji}
                  selected={!!selected}
                  {...(mentionCount > 0
                    ? { type: 'mention', mentionCount }
                    : { type })}
                >
                  {title}
                </Channel>
              </Accordion.Content>
            )
          })}
        </Stack>
      </Stack>
    </Accordion.Item>
  )
}

export { ChannelGroup }
