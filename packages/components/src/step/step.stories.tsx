import { Stack } from '@tamagui/core'

import { Step } from './step'

import type { StepProps } from './step'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Step> = {
  title: 'Components/Step',
  component: Step,
  argTypes: {
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 1000,
      },
    },
    type: {
      control: 'select',
      options: ['neutral', 'complete', 'active'],
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=18126-5278&mode=design&t=QNu79iGJYnhdNqOn-4',
    },
  },
}

type Story = StoryObj<StepProps>

export const Neutral: Story = {
  args: {
    value: 1,
    type: 'neutral',
  },
}

export const Complete: Story = {
  args: {
    value: 1,
    type: 'complete',
  },
}

export const Active: Story = {
  args: {
    value: 1,
    type: 'active',
  },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Stack space flexDirection="row">
      <Stack space alignItems="center">
        <Step type="neutral" value={1} />
        <Step type="neutral" value={10} />
        <Step type="neutral" value={999} />
      </Stack>
      <Stack space alignItems="center">
        <Step type="complete" value={1} />
        <Step type="complete" value={10} />
        <Step type="complete" value={999} />
      </Stack>
      <Stack space alignItems="center">
        <Step type="active" value={1} />
        <Step type="active" value={10} />
        <Step type="active" value={999} />
      </Stack>
    </Stack>
  ),
}

export default meta
