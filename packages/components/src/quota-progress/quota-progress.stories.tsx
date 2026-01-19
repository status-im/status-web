import { QuotaProgressBar } from './quota-progress'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof QuotaProgressBar> = {
  component: QuotaProgressBar,
  title: 'Hub/Quota Progress',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    remaining: {
      control: { type: 'number', min: 0, max: 10000, step: 10 },
      description: 'Number of remaining transactions',
    },
    total: {
      control: { type: 'number', min: 0, max: 10000, step: 10 },
      description: 'Total number of transactions',
    },
    label: {
      control: 'text',
      description: 'Label text for the quota',
    },
  },
  args: {
    remaining: 800,
    total: 1000,
    label: 'free transactions left today',
  },
}

export default meta

type Story = StoryObj<typeof QuotaProgressBar>

export const Default: Story = {}
