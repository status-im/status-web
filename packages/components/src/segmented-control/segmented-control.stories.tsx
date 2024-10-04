import { useArgs } from '@storybook/preview-api'

import { SegmentedControl } from './segmented-control'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/SegmentedControl',
  render: function Render() {
    const [{ activeSegment }, updateArgs] = useArgs()

    return (
      <SegmentedControl.Root
        activeSegment={activeSegment}
        onSegmentChange={value => updateArgs({ activeSegment: value })}
        size={24}
      >
        <SegmentedControl.Button>Option A</SegmentedControl.Button>
        <SegmentedControl.Button>Option B</SegmentedControl.Button>
        <SegmentedControl.Button>Option C</SegmentedControl.Button>
      </SegmentedControl.Root>
    )
  },
} satisfies Meta<typeof SegmentedControl>

type Story = StoryObj<typeof SegmentedControl>

export const Light: Story = {
  args: {
    activeSegment: 'Option A',
  },
}
export const Dark: Story = {
  args: {
    activeSegment: 'Option A',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
