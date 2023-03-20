import { GroupIcon } from '@status-im/icons/16'
import { Stack } from '@tamagui/core'

import { Accordion } from '../accordion/accordion'
import { AccordionItem } from '../accordion/accordionItem'
import { Avatar } from '../avatar'
import { Button } from '../button'
import { Image } from '../image'
import { Text } from '../text'
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
              outline
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
              size={80}
            />
          </Stack>
          <Stack gap={8} marginBottom={12}>
            <Text size={27} weight="semibold">
              {name}
            </Text>
            <Text size={15}>{description}</Text>
          </Stack>
          <Stack flexDirection="row" alignItems="center" mb={12} space={8}>
            <GroupIcon color="$neutral-100" />
            <Text size={15}>{membersCount}</Text>
          </Stack>

          <Button>Join community</Button>
        </Stack>
        {channels.map(group => (
          <Accordion
            key={group.id}
            initialExpanded={group.id === 'welcome'}
            title={group.title}
            unreadCount={group.unreadCount}
          >
            {group.channels.map(channel => {
              return (
                <AccordionItem
                  key={channel.id}
                  channel={channel}
                  selected={selectedChannelId === channel.id}
                  onPress={() => onChannelPress(channel.id)}
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
