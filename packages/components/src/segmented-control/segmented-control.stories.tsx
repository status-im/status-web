import { useState } from 'react'

import { SegmentedControl } from './segmented-control'

import type { Meta, StoryObj } from '@storybook/react'

const SegmentedControlVariant = (
  props: React.ComponentPropsWithoutRef<typeof SegmentedControl.Root>,
) => {
  const [activeSegment, setActiveSegment] = useState('Option A')

  return (
    <SegmentedControl.Root
      {...props}
      activeSegment={activeSegment}
      onSegmentChange={setActiveSegment}
    >
      <SegmentedControl.Button>Option A</SegmentedControl.Button>
      <SegmentedControl.Button>Option B</SegmentedControl.Button>
      <SegmentedControl.Button>Option C</SegmentedControl.Button>
    </SegmentedControl.Root>
  )
}

const meta = {
  title: 'Components/SegmentedControl',
  render: args => {
    return (
      <div className="inline-flex flex-col gap-4">
        <SegmentedControlVariant {...args} />
        <SegmentedControlVariant {...args} size="24" />
        <SegmentedControlVariant {...args} type="dark-grey" />
        <SegmentedControlVariant {...args} type="dark-grey" size="24" />
      </div>
    )
  },
} satisfies Meta<typeof SegmentedControl.Root>

type Story = StoryObj

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
