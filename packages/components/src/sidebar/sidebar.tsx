import { useState } from 'react'

import { Stack } from '@tamagui/core'

import { Accordion } from '../accordion/accordion'
import { AccordionItem } from '../accordion/accordionItem'
import { Avatar } from '../avatar'
import { Button } from '../button'
// import { Button } from '../button'
import { Basketball, Collaboration, Fire, Peach, Play, Unicorn } from '../emoji'
import { Group } from '../icon'
import { Image } from '../image'
import { Heading, Paragraph } from '../typography'

interface Props {
  name: string
  description: string
  membersCount: number
}

interface Channels {
  id: string
  title: string
  icon?: React.ReactNode
  channelStatus?: 'muted' | 'normal' | 'withMessages' | 'withMentions'
  numberOfMessages?: number
}
interface CommunitiesProps {
  id: string
  title: string
  numberOfNewMessages?: number
  channels: Channels[]
}

// MOCK DATA
const COMMUNITIES: CommunitiesProps[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    numberOfNewMessages: 3,
    channels: [
      {
        id: 'welcome',
        title: '# welcome',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'general-welcome',
        title: '# general',
        icon: <Play hasBackground />,
      },
      {
        id: 'random',
        title: '# random',
        icon: <Fire hasBackground />,
      },
      {
        id: 'onboarding',
        title: '# onboarding',
        icon: <Unicorn hasBackground />,
        channelStatus: 'withMentions',
        numberOfMessages: 3,
      },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    numberOfNewMessages: 5,
    channels: [
      {
        id: 'announcements',
        title: '# announcements',
        icon: <Peach hasBackground />,
      },
      {
        id: 'jobs',
        title: '# jobs',
        channelStatus: 'withMentions',
        numberOfMessages: 3,
        icon: <Play hasBackground />,
      },
      {
        id: 'events',
        title: '# events',
        channelStatus: 'withMentions',
        numberOfMessages: 2,
        icon: <Fire hasBackground />,
      },
      {
        id: 'meetups',
        title: '# meetups',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
  {
    id: 'Design',
    title: 'Design',
    channels: [
      {
        id: 'design',
        title: '# design',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'ux',
        title: '# ux',
        icon: <Play hasBackground />,
      },
      {
        id: 'ui',
        title: '# ui',
        icon: <Fire hasBackground />,
      },
      {
        id: 'figma',
        title: '# figma',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
  {
    id: 'General',
    title: 'General',
    channels: [
      {
        id: 'general',
        title: '# general',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'people-ops',
        title: '# people-ops',
        icon: <Basketball hasBackground />,
      },
    ],
  },
  {
    id: 'Frontend',
    title: 'Frontend',
    channels: [
      {
        id: 'react',
        title: '# react',
        icon: <Collaboration hasBackground />,
        channelStatus: 'withMessages',
      },
      {
        id: 'vue',
        title: '# vue',
        icon: <Play hasBackground />,
      },
      {
        id: 'angular',
        title: '# angular',
        channelStatus: 'muted',
        icon: <Fire hasBackground />,
      },
      {
        id: 'svelte',
        title: '# svelte',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
  {
    id: 'Backend',
    title: 'Backend',
    channels: [
      {
        id: 'node',
        title: '# node',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'python',
        title: '# python',
        icon: <Play hasBackground />,
      },
      {
        id: 'ruby',
        title: '# ruby',
        icon: <Fire hasBackground />,
      },
      {
        id: 'php',
        title: '# php',
        channelStatus: 'muted',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
]

const COMMUNITIES_EXPAND_CONTROL = COMMUNITIES.reduce(
  (o, key) => ({ ...o, [key.id]: false }),

  {} as Record<string, boolean>[]
)

const Sidebar = (props: Props) => {
  const { name, description, membersCount } = props
  const [isExpanded, setIsExpanded] = useState({
    ...COMMUNITIES_EXPAND_CONTROL,
    welcome: true,
  })

  const [selectedChannel, setSelectedChannel] = useState('welcome')

  const handleToggle = (id: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof isExpanded],
    }))
  }

  return (
    <Stack backgroundColor="$background">
      <Image
        src="https://images.unsplash.com/photo-1584475784921-d9dbfd9d17ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
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
          <Stack marginTop={-32} marginBottom={12}>
            <Avatar
              withOutline
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
              size={56}
            />
          </Stack>
          <Heading marginBottom={16}>{name}</Heading>
          <Paragraph marginBottom={12}>{description}</Paragraph>
          <Stack flexDirection="row" alignItems="center" mb={12}>
            <Group color="$neutral-100" size={16} />
            <Paragraph ml={8}>{membersCount}</Paragraph>
          </Stack>

          <Button>Join community</Button>
        </Stack>
        {COMMUNITIES.map(community => (
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
            {community.channels.map(channel => (
              <AccordionItem
                key={channel.id}
                icon={channel.icon}
                title={channel.title}
                channelStatus={channel.channelStatus}
                numberOfMessages={channel.numberOfMessages}
                isSelected={selectedChannel === channel.id}
                onPress={() => setSelectedChannel(channel.id)}
              />
            ))}
          </Accordion>
        ))}
        <Stack borderBottomColor="$neutral-10" borderBottomWidth={1} />
        {/* <Button mt={20}>Request to join community</Button> */}
      </Stack>
    </Stack>
  )
}

export { Sidebar }
