import { PinIcon, PlaceholderIcon } from '@status-im/icons'

import { Tab, TabList, TabPanel, Tabs } from './tabs'

import type { Meta, StoryObj } from '@storybook/react'

type Component = typeof Tabs

const meta: Meta<Component> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<Component>

export const Light: Story = {
  render: args => (
    <div
      className=" flex flex-col gap-4 bg-default-customisation-army/40 p-10"
      // data-background="blur"
    >
      <Tabs {...args}>
        <TabList aria-label="History of Ancient Rome">
          <Tab id="FoR">Founding of Rome</Tab>
          <Tab id="MaR">Monarchy and Republic</Tab>
          <Tab id="Emp">Empire</Tab>
        </TabList>
        <TabPanel id="FoR">
          Arma virumque cano, Troiae qui primus ab oris.
        </TabPanel>
        <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
        <TabPanel id="Emp">Alea jacta est.</TabPanel>
      </Tabs>

      <Tabs {...args}>
        <TabList aria-label="History of Ancient Rome">
          <Tab size="24" id="FoR" icon={PlaceholderIcon}>
            Founding of Rome
          </Tab>
          <Tab size="24" id="MaR">
            Monarchy and Republic
          </Tab>
          <Tab size="24" id="Emp">
            Empire
          </Tab>
        </TabList>
        <TabPanel id="FoR">
          Arma virumque cano, Troiae qui primus ab oris.
        </TabPanel>
        <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
        <TabPanel id="Emp">Alea jacta est.</TabPanel>
      </Tabs>
    </div>
  ),
}

export const Dark: Story = {}

export const LightBlur: Story = {
  render: args => (
    <div
      className=" flex flex-col gap-4 bg-default-customisation-army/40 p-10"
      // data-background="blur"
    >
      <Tabs {...args}>
        <TabList aria-label="History of Ancient Rome">
          <Tab id="FoR">Founding of Rome</Tab>
          <Tab id="MaR">Monarchy and Republic</Tab>
          <Tab id="Emp">Empire</Tab>
        </TabList>
        <TabPanel id="FoR">
          Arma virumque cano, Troiae qui primus ab oris.
        </TabPanel>
        <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
        <TabPanel id="Emp">Alea jacta est.</TabPanel>
      </Tabs>

      <Tabs {...args}>
        <TabList aria-label="History of Ancient Rome">
          <Tab size="24" id="FoR" icon={PlaceholderIcon}>
            Founding of Rome
          </Tab>
          <Tab size="24" id="MaR">
            Monarchy and Republic
          </Tab>
          <Tab size="24" id="Emp">
            Empire
          </Tab>
        </TabList>
        <TabPanel id="FoR">
          Arma virumque cano, Troiae qui primus ab oris.
        </TabPanel>
        <TabPanel id="MaR">Senatus Populusque Romanus.</TabPanel>
        <TabPanel id="Emp">Alea jacta est.</TabPanel>
      </Tabs>
    </div>
  ),
}
