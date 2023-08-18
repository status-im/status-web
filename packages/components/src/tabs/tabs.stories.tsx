import { PlaceholderIcon } from '@status-im/icons'

import { Text } from '../text'
import { Tabs } from './tabs'

import type { TabsProps } from './tabs'
import type { Meta, StoryObj } from '@storybook/react'

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

export const Default: StoryObj<TabsProps> = {
  args: {
    defaultValue: '1',
  },
  render(args) {
    // const icon = args.icon ? <PlaceholderIcon size={20} /> : undefined
    // const count = args.count ? 8 : undefined

    return (
      <Tabs {...args}>
        <Tabs.List size={32}>
          <Tabs.Trigger type="default" value="1">
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger type="default" value="2">
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger type="default" value="3">
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

export const Icon: StoryObj<TabsProps> = {
  args: {
    defaultValue: '1',
  },
  render(args) {
    return (
      <Tabs {...args}>
        <Tabs.List size={32}>
          <Tabs.Trigger
            type="icon"
            value="1"
            icon={<PlaceholderIcon size={16} />}
          >
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger
            type="icon"
            value="2"
            icon={<PlaceholderIcon size={16} />}
          >
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger
            type="icon"
            value="3"
            icon={<PlaceholderIcon size={16} />}
          >
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

export const Counter: StoryObj<TabsProps> = {
  args: {
    defaultValue: '1',
  },
  render(args) {
    return (
      <Tabs {...args}>
        <Tabs.List size={32}>
          <Tabs.Trigger type="counter" value="1" count={5}>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger type="counter" value="2" count={10}>
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger type="counter" value="3" count={100}>
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

export const Step: StoryObj<TabsProps> = {
  args: {
    defaultValue: '1',
  },
  render(args) {
    return (
      <Tabs {...args}>
        <Tabs.List size={32}>
          <Tabs.Trigger type="step" value="1" step={1}>
            Tab 1
          </Tabs.Trigger>
          <Tabs.Trigger type="step" value="2" step={2}>
            Tab 2
          </Tabs.Trigger>
          <Tabs.Trigger type="step" value="3" step={3}>
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
