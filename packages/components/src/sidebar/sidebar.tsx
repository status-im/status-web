import { useState } from 'react'

import { GroupIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'

import { Accordion } from '../accordion/accordion'
import { AccordionItem } from '../accordion/accordionItem'
import { Avatar } from '../avatar'
import { Button } from '../button'
import { Image } from '../image'
import { Heading, Paragraph } from '../typography'
import { COMMUNITIES } from './mock-data'

import type { CommunityProps } from './mock-data'
import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof Stack>

type Props = {
  name: string
  description: string
  membersCount: number
  selectedChannel?: string
  communities?: CommunityProps[]
  onChannelPress: (channelId: string) => void
} & BaseProps

const Sidebar = (props: Props) => {
  const {
    name,
    description,
    membersCount,
    communities = COMMUNITIES,
    selectedChannel,
    onChannelPress,
  } = props

  const communitiesExpandControl = communities.reduce(
    (o, key) => ({ ...o, [key.id]: false }),

    {} as Record<string, boolean>[]
  )

  const [isExpanded, setIsExpanded] = useState({
    ...communitiesExpandControl,
    welcome: true,
    community: true,
    design: true,
  })

  const handleToggle = (id: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof isExpanded],
    }))
  }

  return (
    <Stack
      backgroundColor="$background"
      borderRightWidth={1}
      borderColor="$neutral-10"
      height="100%"
      overflow="scroll"
    >
      <Image
        src="https://images.unsplash.com/photo-1574786527860-f2e274867c91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1764&q=80"
        width="full"
        aspectRatio={2.6}
      />
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
            <GroupIcon color="$neutral-100" size={16} />
            <Paragraph ml={8}>{membersCount}</Paragraph>
          </Stack>

          <Button>Join community</Button>
        </Stack>
        {communities.map(community => (
          <Accordion
            key={community.id}
            isExpanded={!!isExpanded[community.id as keyof typeof isExpanded]}
            onToggle={() => handleToggle(community.id)}
            title={community.title}
            numberOfNewMessages={community.numberOfNewMessages}
            showNotifications={
              !isExpanded[community.id as keyof typeof isExpanded]
            }
          >
            {community.channels.map((channel, index) => {
              const isLastChannelOfTheList =
                index === community.channels.length - 1
              return (
                <AccordionItem
                  key={channel.id}
                  icon={channel.icon}
                  title={channel.title}
                  channelStatus={channel.channelStatus}
                  numberOfMessages={channel.numberOfMessages}
                  isSelected={selectedChannel === channel.id}
                  onPress={() => onChannelPress(channel.id)}
                  mb={isLastChannelOfTheList ? 8 : 0}
                />
              )
            })}
          </Accordion>
        ))}
        <Stack borderBottomColor="$neutral-10" borderBottomWidth={1} />
        {/* <Button mt={20}>Request to join community</Button> */}
      </Stack>
    </Stack>
  )
}

export { Sidebar }
