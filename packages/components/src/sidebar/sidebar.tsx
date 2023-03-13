import { GroupIcon } from '@status-im/icons/16'
import { Stack } from '@tamagui/core'

import { Accordion } from '../accordion/accordion'
import { AccordionItem } from '../accordion/accordionItem'
import { Avatar } from '../avatar'
import { Button } from '../button'
import { Image } from '../image'
import { Heading, Paragraph } from '../typography'
import { CHANNEL_GROUPS } from './mock-data'

import type { ChannelGroup } from './mock-data'

type Props = {
  community: {
    name: string
    description: string
    membersCount: number
    imageUrl: string
  }
  channels?: ChannelGroup[]
  selectedChannelId?: string
  onChannelPress: (channelId: string) => void
}

const Sidebar = (props: Props) => {
  const {
    community,
    channels = CHANNEL_GROUPS,
    selectedChannelId,
    onChannelPress,
  } = props

  const { name, description, membersCount, imageUrl } = community

  return (
    <Stack
      backgroundColor="$background"
      borderRightWidth={1}
      borderColor="$neutral-10"
      height="100%"
      overflow="scroll"
    >
      <Image src={imageUrl} width="full" aspectRatio={2.6} />
      <Stack
        paddingBottom={16}
        marginTop={-16}
        backgroundColor="$background"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        zIndex={10}
      >
        <Stack paddingHorizontal={16} paddingBottom={16}>
          <Stack marginTop={-40} marginBottom={12}>
            <Avatar
              withOutline
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
              size={80}
            />
          </Stack>
          <Heading marginBottom={16}>{name}</Heading>
          <Paragraph marginBottom={12}>{description}</Paragraph>
          <Stack flexDirection="row" alignItems="center" mb={12}>
            <GroupIcon color="$neutral-100" />
            <Paragraph ml={8}>{membersCount}</Paragraph>
          </Stack>

          <Button>Join community</Button>
        </Stack>
        {channels.map(group => (
          <Accordion
            key={group.id}
            initialExpanded={group.id === 'welcome'}
            title={group.title}
            numberOfNewMessages={group.unreadCount}
          >
            {group.channels.map((channel, index) => {
              const isLastChannelOfTheList = index === group.channels.length - 1

              return (
                <AccordionItem
                  key={channel.id}
                  channel={channel}
                  isSelected={selectedChannelId === channel.id}
                  onPress={() => onChannelPress(channel.id)}
                  mb={isLastChannelOfTheList ? 8 : 0}
                />
              )
            })}
          </Accordion>
        ))}
        <Stack borderBottomColor="$neutral-10" borderBottomWidth={1} />
      </Stack>
    </Stack>
  )
}

export { Sidebar }
