import { useState } from 'react'

import { Stack } from '@tamagui/core'

import { Accordion } from '../accordion/accordion'
import { AccordionItem } from '../accordion/accordionItem'
import { Avatar } from '../avatar'
// import { Button } from '../button'
import { Collaboration, Fire, Peach, Play, Unicorn } from '../emoji'
import { Group } from '../icon'
import { Image } from '../image'
import { Heading, Paragraph } from '../typography'

interface Props {
  name: string
  description: string
  membersCount: number
}

// MOCK DATA
const COMMUNITIES = [
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
        id: 'general',
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
    id: 'Frontend',
    title: 'Frontend',
    channels: [
      {
        id: 'react',
        title: '# react',
        icon: <Collaboration hasBackground />,
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
  (o, key) => ({ ...o, [key.title]: false }),
  {}
)

const _Sidebar = (props: Props) => {
  const { name, description, membersCount } = props
  const [isExpanded, setIsExpanded] = useState(COMMUNITIES_EXPAND_CONTROL)

  const [selectedChannel, setSelectedChannel] = useState('welcome')

  const handleToggle = (id: string) => {
    setIsExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Stack backgroundColor="$background">
      <Image
        src="https://images.unsplash.com/photo-1584475784921-d9dbfd9d17ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
        width={350}
        height={136}
      />
      <Stack
        paddingBottom={16}
        marginTop={-16}
        backgroundColor="$background"
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        zIndex={10}
      >
        <Stack paddingHorizontal={16}>
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
        </Stack>
        {COMMUNITIES.map(community => (
          <Accordion
            key={community.id}
            isExpanded={isExpanded[community.id]}
            onToggle={() => handleToggle(community.id)}
            title={community.title}
            numberOfNewMessages={community.numberOfNewMessages}
            showNotifications={!isExpanded[community.id]}
          >
            {community.channels.map(channel => (
              <AccordionItem
                key={channel.id}
                icon={channel.icon}
                title={channel.title}
                channelStatus={channel.channelStatus as any}
                numberOfMessages={channel.numberOfMessages}
                isSelected={selectedChannel === channel.id}
                onPress={() => setSelectedChannel(channel.id)}
              />
            ))}
          </Accordion>
        ))}
        <Stack borderBottomColor="$neutral-10" borderBottomWidth={1} />

        {/* <Accordion
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          title="Welcome"
          numberOfNewMessages={3}
          showNotifications={!isExpanded}
        >
          <AccordionItem
            icon={<Collaboration hasBackground />}
            title="# welcome"
            channelStatus="normal"
            isSelected={selectedChannel === 0}
            onPress={() => setSelectedChannel(0)}
          />
          <AccordionItem
            icon={<Play hasBackground />}
            title="# random"
            channelStatus="muted"
            isSelected={selectedChannel === 1}
            onPress={() => setSelectedChannel(1)}
          />
          <AccordionItem
            icon={<Fire hasBackground />}
            title="# onboarding"
            channelStatus="withMessages"
            isSelected={selectedChannel === 2}
            onPress={() => setSelectedChannel(2)}
          />
          <AccordionItem
            icon={<Unicorn hasBackground />}
            title="# intro"
            channelStatus="withMentions"
            numberOfMessages={3}
            isSelected={selectedChannel === 3}
            onPress={() => setSelectedChannel(3)}
          />
        </Accordion>
        <Accordion
          isExpanded={isExpandedSecondGroup}
          onToggle={() => setIsExpandedSecondGroup(!isExpandedSecondGroup)}
          title="Design"
        >
          <AccordionItem
            icon={<Collaboration hasBackground />}
            title="# general"
            channelStatus="normal"
            isSelected={selectedChannel === 4}
            onPress={() => setSelectedChannel(4)}
          />
          <AccordionItem
            icon={<Play hasBackground />}
            title="# help"
            channelStatus="muted"
            isSelected={selectedChannel === 5}
            onPress={() => setSelectedChannel(5)}
          />
          <AccordionItem
            icon={<Collaboration hasBackground />}
            title="# research"
            isSelected={selectedChannel === 6}
            onPress={() => setSelectedChannel(6)}
          />
        </Accordion>
        <Accordion
          isExpanded={isExpandedSecondGroup}
          onToggle={() => setIsExpandedSecondGroup(!isExpandedSecondGroup)}
          title="General"
        >
          <AccordionItem
            icon={<Peach hasBackground />}
            title="# general"
            channelStatus="withMentions"
            numberOfMessages={5}
            isSelected={selectedChannel === 7}
            onPress={() => setSelectedChannel(7)}
          />
          <AccordionItem
            icon={<Play hasBackground />}
            title="# help"
            channelStatus="muted"
            isSelected={selectedChannel === 8}
            onPress={() => setSelectedChannel(8)}
          />
          <AccordionItem
            icon={<Collaboration hasBackground />}
            title="# research"
            isSelected={selectedChannel === 8}
            onPress={() => setSelectedChannel(8)}
          />
        </Accordion> */}

        {/* <Button mt={20}>Request to join community</Button> */}
      </Stack>
    </Stack>
  )
}

export const Sidebar = _Sidebar
