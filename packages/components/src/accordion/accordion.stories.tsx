import { CHANNEL_GROUPS } from '../sidebar/mock-data'
import { Accordion } from './accordion'
import { AccordionItem } from './accordionItem'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  argTypes: {},
  args: {
    unreadCount: 3,
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
          selected
          channel={CHANNEL_GROUPS[0].channels[0]}
        />
        <AccordionItem key="general" channel={CHANNEL_GROUPS[0].channels[0]} />
        <AccordionItem key="lounge" channel={CHANNEL_GROUPS[0].channels[0]} />
        <AccordionItem key="random" channel={CHANNEL_GROUPS[0].channels[0]} />
      </>
    ),
  },
}

export default meta
