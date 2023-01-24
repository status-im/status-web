import { Basketball, Collaboration, Play, Unicorn } from '../emoji'
import { Accordion } from './accordion'
import { AccordionItem } from './accordionItem'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  argTypes: {},
  args: {
    numberOfNewMessages: 3,
    title: 'Welcome',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=14849%3A172544&t=4BeIzudVkio0c6Px-4',
    },
  },
}

type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  args: {
    children: (
      <>
        <AccordionItem
          key="welcome"
          icon={<Unicorn hasBackground />}
          title={'# welcome'}
          channelStatus="withMessages"
          numberOfMessages={1}
          isSelected
          onPress={() => {
            // do nothing
          }}
        />
        <AccordionItem
          key="general"
          icon={<Basketball hasBackground />}
          title={'# general'}
          channelStatus="withMentions"
          numberOfMessages={2}
          onPress={() => {
            // do nothing
          }}
          mb={8}
        />
        <AccordionItem
          key="lounge"
          icon={<Collaboration hasBackground />}
          title={'# lounge'}
          numberOfMessages={0}
          onPress={() => {
            // do nothing
          }}
          mb={8}
        />
        <AccordionItem
          key="random"
          icon={<Play hasBackground />}
          title={'# random'}
          channelStatus="muted"
          numberOfMessages={0}
          onPress={() => {
            // do nothing
          }}
          mb={8}
        />
      </>
    ),
  },
}

export default meta
