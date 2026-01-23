import { QuotaProgressBar } from './quota-progress'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Hub/Quota Progress',
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const quotaValues = [
      { remaining: 2, total: 2 },
      { remaining: 1, total: 2 },
      { remaining: 0, total: 2 },
      { remaining: 4, total: 6 },
      { remaining: 3, total: 6 },
      { remaining: 0, total: 6 },
      { remaining: 7485, total: 10000 },
      { remaining: 5040, total: 10000 },
      { remaining: 1000, total: 10000 },
      { remaining: 180466, total: 240000 },
      { remaining: 110234, total: 240000 },
      { remaining: 5000, total: 240000 },
    ]

    return (
      <div className="flex w-full flex-col gap-8">
        {quotaValues.map((quota, index) => (
          <div key={index} className="w-full">
            <QuotaProgressBar
              remaining={quota.remaining}
              total={quota.total}
              label="free transactions left today"
            />
          </div>
        ))}
      </div>
    )
  },
}

export default meta

type Story = StoryObj

export const AllQuotas: Story = {}
