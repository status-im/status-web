import { PlaceholderIcon } from '@status-im/icons/20'

import { Text } from '../text'
import { Tabs } from './tabs'

import type { Meta, StoryObj } from '@storybook/react'
import type { ComponentProps } from 'react'

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  argTypes: {},

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=57-13214&t=q5DFi3jlBAcdghLy-11',
    },
  },
}

type Story = StoryObj<{ size: 24 | 32; icon: boolean }>

export const Default: Story = {
  name: 'Default',
  args: {
    size: 24,
    icon: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: [24, 32] satisfies ComponentProps<typeof Tabs.List>['size'][],
    },
    icon: {
      control: 'boolean',
    },
  },
  render(args) {
    const icon = args.icon ? <PlaceholderIcon /> : undefined

    return (
      <Tabs defaultValue="1">
        <Tabs.List size={args.size}>
          <Tabs.Trigger value="1" icon={icon}>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger value="2" icon={icon}>
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger value="3" icon={icon}>
            Tab 3
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="1">
          <Text size={15}>Content 1</Text>
        </Tabs.Content>
        <Tabs.Content value="2">
          <Text size={15}>Content 2</Text>
        </Tabs.Content>
        <Tabs.Content value="3">
          <Text size={15}>Content 3</Text>
        </Tabs.Content>
      </Tabs>
    )
  },
}

export default meta
