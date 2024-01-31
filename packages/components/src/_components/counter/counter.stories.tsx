import { Counter } from './counter'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Counter> = {
  title: 'Components/Counter',
  component: Counter,

  render: () => (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3">
        <Counter variant="default" value={5} />
        <Counter variant="secondary" value={5} />
        <Counter variant="grey" value={5} />
        <Counter variant="outline" value={5} />
      </div>
      <div className="flex gap-3">
        <Counter variant="default" value={10} />
        <Counter variant="secondary" value={10} />
        <Counter variant="grey" value={10} />
        <Counter variant="outline" value={10} />
      </div>
      <div className="flex gap-3">
        <Counter variant="default" value={100} />
        <Counter variant="secondary" value={100} />
        <Counter variant="grey" value={100} />
        <Counter variant="outline" value={100} />
      </div>
    </div>
  ),
}

type Story = StoryObj<typeof Counter>

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
