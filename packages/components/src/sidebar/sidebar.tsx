import { useState } from 'react'

import { Stack } from '@tamagui/core'

import { Accordion } from '../accordion/accordion'
import { AccordionItem } from '../accordion/accordionItem'
import { Avatar } from '../avatar'
import { Button } from '../button'
import { Collaboration, Fire, Play } from '../emoji'
import { Group } from '../icon'
import { Image } from '../image'
import { Heading, Paragraph } from '../typography'

interface Props {
  name: string
  description: string
  membersCount: number
}

const _Sidebar = (props: Props) => {
  const { name, description, membersCount } = props
  const [isExpanded, setIsExpanded] = useState(false)
  const [isExpandedSecondGroup, setIsExpandedSecondGroup] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(0)

  return (
    <Stack backgroundColor="$background">
      <Image
        src="https://images.unsplash.com/photo-1584475784921-d9dbfd9d17ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
        width={350}
        height={136}
      />
      <Stack
        paddingHorizontal={16}
        paddingBottom={16}
        marginTop={-16}
        backgroundColor="$background"
        borderTopLeftRadius={16}
        borderTopRightRadius={16}
        zIndex={10}
      >
        <Stack marginTop={-32} marginBottom={12}>
          <Avatar
            src="https://images.unsplash.com/photo-1553835973-dec43bfddbeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            size={56}
          />
        </Stack>
        <Heading marginBottom={16}>{name}</Heading>
        <Paragraph marginBottom={12}>{description}</Paragraph>
        <Stack flexDirection="row" alignItems="center" mb={12}>
          <Group color="$neutral-100" size={16} />
          <Paragraph ml={8}>{membersCount}</Paragraph>
        </Stack>
        <Accordion
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          title="Welcome"
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
            icon={<Collaboration hasBackground />}
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
        <Stack borderBottomColor="$neutral-10" borderBottomWidth={1} />

        <Button mt={20}>Request to join community</Button>
      </Stack>
    </Stack>
  )
}

export const Sidebar = _Sidebar
