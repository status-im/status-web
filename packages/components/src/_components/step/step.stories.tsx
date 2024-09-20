import { Step } from './'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Step> = {
  title: 'Components/Step',
  component: Step,

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=18158-12502&node-type=canvas&m=dev',
    },
  },

  render: () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Step value={1} variant="outline" />
          <Step value={2} variant="primary" />
          <Step value={3} variant="secondary" />
          <Step value={4} size={22} variant="outline" />
          <Step value={5} size={22} variant="primary" />
          <Step value={6} size={22} variant="secondary" />
        </div>
        <div className="flex gap-4">
          <Step value={999} variant="outline" />
          <Step value={999} variant="primary" />
          <Step value={999} variant="secondary" />
          <Step value={999} size={22} variant="outline" />
          <Step value={999} size={22} variant="primary" />
          <Step value={999} size={22} variant="secondary" />
        </div>
      </div>
    )
  },
}

export default meta

type Story = StoryObj<typeof Step>

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
