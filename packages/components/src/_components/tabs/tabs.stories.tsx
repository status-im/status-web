import { PinIcon, PlaceholderIcon } from '@status-im/icons/20'

import { Tabs } from './'

import type { Meta, StoryObj } from '@storybook/react'

type Component = typeof Tabs

const meta: Meta<Component> = {
  title: 'Components/Tabs',
  component: Tabs,
  // parameters: {
  //   layout: 'centered',
  // },

  render: args => (
    <div
      className="flex flex-col gap-4 p-10"
      // data-background="blur"
    >
      <Tabs.Root {...args}>
        <Tabs.List aria-label="History of Ancient Rome">
          <Tabs.Trigger value="FoR">Founding of Rome</Tabs.Trigger>
          <Tabs.Trigger value="MaR">Monarchy and Republic</Tabs.Trigger>
          <Tabs.Trigger value="Emp">Empire</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="FoR">
          Arma virumque cano, Troiae qui primus ab oris.
        </Tabs.Content>
        <Tabs.Content value="MaR">Senatus Populusque Romanus.</Tabs.Content>
        <Tabs.Content value="Emp">Alea jacta est.</Tabs.Content>
      </Tabs.Root>

      <Tabs.Root {...args}>
        <Tabs.List aria-label="History of Ancient Rome">
          <Tabs.Trigger size="24" value="FoR" icon={PlaceholderIcon}>
            Founding of Rome
          </Tabs.Trigger>
          <Tabs.Trigger size="24" value="MaR">
            Monarchy and Republic
          </Tabs.Trigger>
          <Tabs.Trigger size="24" value="Emp">
            Empire
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="FoR">
          Arma virumque cano, Troiae qui primus ab oris.
        </Tabs.Content>
        <Tabs.Content value="MaR">Senatus Populusque Romanus.</Tabs.Content>
        <Tabs.Content value="Emp">Alea jacta est.</Tabs.Content>
      </Tabs.Root>
    </div>
  ),
}

export default meta

type Story = StoryObj<Component>

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
