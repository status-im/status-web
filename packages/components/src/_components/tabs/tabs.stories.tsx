import { useState } from 'react'

import { PlaceholderIcon } from '@status-im/icons/20'

import { Tabs } from './'

import type { Meta, StoryObj } from '@storybook/react'

const TabsVariant = (
  props: React.ComponentPropsWithoutRef<typeof Tabs.Root>,
) => {
  const [value, setValue] = useState('FoR')

  return (
    <Tabs.Root {...props} value={value} onValueChange={setValue}>
      <Tabs.List aria-label="History of Ancient Rome">
        <Tabs.Trigger value="FoR" icon={<PlaceholderIcon />}>
          Founding of Rome
        </Tabs.Trigger>
        <Tabs.Trigger value="MaR">Monarchy and Republic</Tabs.Trigger>
        <Tabs.Trigger value="Emp">Empire</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="FoR">
        Arma virumque cano, Troiae qui primus ab oris.
      </Tabs.Content>
      <Tabs.Content value="MaR">Senatus Populusque Romanus.</Tabs.Content>
      <Tabs.Content value="Emp">Alea jacta est.</Tabs.Content>
    </Tabs.Root>
  )
}

const meta: Meta = {
  title: 'Components/Tabs',
  // parameters: {
  //   layout: 'centered',
  // },

  render: args => {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <TabsVariant {...args} variant="grey" size="24" />
          <TabsVariant {...args} variant="grey" size="32" />
        </div>

        <div className="flex flex-col gap-2">
          <TabsVariant {...args} variant="dark-grey" size="32" />
          <TabsVariant {...args} variant="dark-grey" size="24" />
        </div>
      </div>
    )
  },
}

export default meta

type Story = StoryObj

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
