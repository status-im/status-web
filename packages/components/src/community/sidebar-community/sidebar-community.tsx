import { useState } from 'react'

import { CommunitiesIcon, MembersIcon } from '@felicio/icons'
import * as Accordion from '@radix-ui/react-accordion'
import { Stack } from '@tamagui/core'

import { Avatar } from '../../avatar'
import { Button } from '../../button'
import { Image } from '../../image'
import { SidebarSkeleton } from '../../skeleton/sidebar-skeleton'
import { Text } from '../../text'
import { CHANNEL_GROUPS } from '../mock-data'
import { ChannelGroup } from './components/channel-group'

import type { ChannelGroupType } from '../mock-data'

type Props = {
  community: {
    name: string
    description: string
    membersCount: number
    imageSrc: string
  }
  channels?: ChannelGroupType[]
  selectedChannelId?: string
  onChannelPress: (channelId: string) => void
  loading?: boolean
}

const SidebarCommunity = (props: Props) => {
  const {
    community,
    channels = CHANNEL_GROUPS,
    selectedChannelId,
    loading,
    // onChannelPress,
  } = props

  const { name, description, membersCount, imageSrc } = community

  const [value, setValue] = useState(['Welcome'])

  if (loading) {
    return <SidebarSkeleton />
  }

  return (
    <Stack
      backgroundColor="$background"
      borderRightWidth={1}
      borderColor="$neutral-10"
      height="100%"
      overflow="scroll"
    >
      <Image src={imageSrc} width="full" aspectRatio={2.6} />
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
            <Stack>
              <Stack
                borderWidth={2}
                borderColor={'$white-100'}
                borderRadius={'$full'}
                width="fit-content"
              >
                <Avatar
                  type="community"
                  name="Community"
                  src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
                  size={80}
                />
              </Stack>
            </Stack>
          </Stack>
          <Stack gap={8} marginBottom={12}>
            <Text size={27} weight="semibold">
              {name}
            </Text>
            <Text size={15}>{description}</Text>
          </Stack>
          <Stack
            flexDirection="row"
            alignItems="center"
            marginBottom={12}
            gap={4}
          >
            <MembersIcon size={16} color="$neutral-50" />
            <Text size={15}>{membersCount}</Text>
          </Stack>

          <Button icon={<CommunitiesIcon size={20} />}>
            Request to join community
          </Button>
        </Stack>

        <Accordion.Root type="multiple" value={value} onValueChange={setValue}>
          {channels.map(group => {
            return (
              <ChannelGroup
                key={group.id}
                name={group.title}
                unreadCount={group.unreadCount}
                channels={group.channels}
                expanded={value.includes(group.title)}
                selectedChannelId={selectedChannelId}
              />
            )
          })}
        </Accordion.Root>
      </Stack>
    </Stack>
  )
}

export { SidebarCommunity }
