import { QuotaProgressBar } from './quota-progress'

import type { Meta, StoryObj } from '@storybook/react'

type StoryArgs = {
  quotaDefault2_2_remaining: number
  quotaDefault2_2_total: number
  quotaDefault1_2_remaining: number
  quotaDefault1_2_total: number
  quotaDefault0_2_remaining: number
  quotaDefault0_2_total: number
  quotaDefault4_6_remaining: number
  quotaDefault4_6_total: number
  quotaDefault3_6_remaining: number
  quotaDefault3_6_total: number
  quotaDefault0_6_remaining: number
  quotaDefault0_6_total: number
  quotaDefault7485_10000_remaining: number
  quotaDefault7485_10000_total: number
  quotaDefault5040_10000_remaining: number
  quotaDefault5040_10000_total: number
  quotaDefault1000_10000_remaining: number
  quotaDefault1000_10000_total: number
  quotaDefault180466_240000_remaining: number
  quotaDefault180466_240000_total: number
  quotaDefault110234_240000_remaining: number
  quotaDefault110234_240000_total: number
  quotaDefault5000_240000_remaining: number
  quotaDefault5000_240000_total: number
}

const meta: Meta<StoryArgs> = {
  title: 'Hub/Quota Progress',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    quotaDefault2_2_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 2/2)',
      table: { category: 'Quota 2/2' },
    },
    quotaDefault2_2_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 2/2)',
      table: { category: 'Quota 2/2' },
    },
    quotaDefault1_2_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 1/2)',
      table: { category: 'Quota 1/2' },
    },
    quotaDefault1_2_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 1/2)',
      table: { category: 'Quota 1/2' },
    },
    quotaDefault0_2_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 0/2)',
      table: { category: 'Quota 0/2' },
    },
    quotaDefault0_2_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 0/2)',
      table: { category: 'Quota 0/2' },
    },
    quotaDefault4_6_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 4/6)',
      table: { category: 'Quota 4/6' },
    },
    quotaDefault4_6_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 4/6)',
      table: { category: 'Quota 4/6' },
    },
    quotaDefault3_6_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 3/6)',
      table: { category: 'Quota 3/6' },
    },
    quotaDefault3_6_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 3/6)',
      table: { category: 'Quota 3/6' },
    },
    quotaDefault0_6_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 0/6)',
      table: { category: 'Quota 0/6' },
    },
    quotaDefault0_6_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 0/6)',
      table: { category: 'Quota 0/6' },
    },
    quotaDefault7485_10000_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 7485/10000)',
      table: { category: 'Quota 7485/10000' },
    },
    quotaDefault7485_10000_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 7485/10000)',
      table: { category: 'Quota 7485/10000' },
    },
    quotaDefault5040_10000_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 5040/10000)',
      table: { category: 'Quota 5040/10000' },
    },
    quotaDefault5040_10000_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 5040/10000)',
      table: { category: 'Quota 5040/10000' },
    },
    quotaDefault1000_10000_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 1000/10000)',
      table: { category: 'Quota 1000/10000' },
    },
    quotaDefault1000_10000_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 1000/10000)',
      table: { category: 'Quota 1000/10000' },
    },
    quotaDefault180466_240000_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 180466/240000)',
      table: { category: 'Quota 180466/240000' },
    },
    quotaDefault180466_240000_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 180466/240000)',
      table: { category: 'Quota 180466/240000' },
    },
    quotaDefault110234_240000_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 110234/240000)',
      table: { category: 'Quota 110234/240000' },
    },
    quotaDefault110234_240000_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 110234/240000)',
      table: { category: 'Quota 110234/240000' },
    },
    quotaDefault5000_240000_remaining: {
      control: { type: 'number', min: 0 },
      description: 'Quota remaining (default: 5000/240000)',
      table: { category: 'Quota 5000/240000' },
    },
    quotaDefault5000_240000_total: {
      control: { type: 'number', min: 0 },
      description: 'Quota total (default: 5000/240000)',
      table: { category: 'Quota 5000/240000' },
    },
  },
  args: {
    quotaDefault2_2_remaining: 2,
    quotaDefault2_2_total: 2,
    quotaDefault1_2_remaining: 1,
    quotaDefault1_2_total: 2,
    quotaDefault0_2_remaining: 0,
    quotaDefault0_2_total: 2,
    quotaDefault4_6_remaining: 4,
    quotaDefault4_6_total: 6,
    quotaDefault3_6_remaining: 3,
    quotaDefault3_6_total: 6,
    quotaDefault0_6_remaining: 0,
    quotaDefault0_6_total: 6,
    quotaDefault7485_10000_remaining: 7485,
    quotaDefault7485_10000_total: 10000,
    quotaDefault5040_10000_remaining: 5040,
    quotaDefault5040_10000_total: 10000,
    quotaDefault1000_10000_remaining: 1000,
    quotaDefault1000_10000_total: 10000,
    quotaDefault180466_240000_remaining: 180466,
    quotaDefault180466_240000_total: 240000,
    quotaDefault110234_240000_remaining: 110234,
    quotaDefault110234_240000_total: 240000,
    quotaDefault5000_240000_remaining: 5000,
    quotaDefault5000_240000_total: 240000,
  },
  render: (args: StoryArgs) => {
    const quotaValues = [
      {
        remaining: args.quotaDefault2_2_remaining,
        total: args.quotaDefault2_2_total,
      },
      {
        remaining: args.quotaDefault1_2_remaining,
        total: args.quotaDefault1_2_total,
      },
      {
        remaining: args.quotaDefault0_2_remaining,
        total: args.quotaDefault0_2_total,
      },
      {
        remaining: args.quotaDefault4_6_remaining,
        total: args.quotaDefault4_6_total,
      },
      {
        remaining: args.quotaDefault3_6_remaining,
        total: args.quotaDefault3_6_total,
      },
      {
        remaining: args.quotaDefault0_6_remaining,
        total: args.quotaDefault0_6_total,
      },
      {
        remaining: args.quotaDefault7485_10000_remaining,
        total: args.quotaDefault7485_10000_total,
      },
      {
        remaining: args.quotaDefault5040_10000_remaining,
        total: args.quotaDefault5040_10000_total,
      },
      {
        remaining: args.quotaDefault1000_10000_remaining,
        total: args.quotaDefault1000_10000_total,
      },
      {
        remaining: args.quotaDefault180466_240000_remaining,
        total: args.quotaDefault180466_240000_total,
      },
      {
        remaining: args.quotaDefault110234_240000_remaining,
        total: args.quotaDefault110234_240000_total,
      },
      {
        remaining: args.quotaDefault5000_240000_remaining,
        total: args.quotaDefault5000_240000_total,
      },
    ]

    return (
      <div className="mb-8 flex w-full flex-col gap-12">
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

type Story = StoryObj<StoryArgs>

export const AllQuotas: Story = {}
