import {
  blur,
  customisation,
  danger,
  networks,
  neutral,
  security,
  social,
  success,
  white,
} from '@status-im/colors'

import type { Meta, StoryObj } from '@storybook/react'

type Args = {
  colors: [string, string][]
}

const meta: Meta<Args> = {
  title: 'Colors / All',
  argTypes: {
    colors: {
      table: {
        disable: true,
      },
    },
  },
  render: ({ colors }) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
      {colors.map(([key, value]) => (
        <div key={key} className="flex flex-col items-center gap-2.5">
          <div
            className="size-20 rounded-6 border-neutral-10"
            style={{ backgroundColor: value }}
          />
          <span className="text-11 text-neutral-80 dark:text-white-80">
            {key}
          </span>
          <span className="text-11 text-neutral-50 dark:text-white-60">
            {value}
          </span>
        </div>
      ))}
    </div>
  ),
}

type Story = StoryObj<Args>

export const Customisation: Story = {
  args: {
    colors: Object.entries(customisation).map(([key, value]) => [
      key,
      value['50'],
    ]),
  },
}

export const Neutral: Story = {
  args: { colors: Object.entries(neutral) },
}

export const Success: Story = {
  args: { colors: Object.entries(success) },
}

export const Danger: Story = {
  args: { colors: Object.entries(danger) },
}

export const Blur: Story = {
  args: { colors: Object.entries(blur) },
}

export const Networks: Story = {
  args: { colors: Object.entries(networks) },
}

export const Security: Story = {
  args: { colors: Object.entries(security) },
}

export const Social: Story = {
  args: { colors: Object.entries(social) },
}

export const White: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  args: { colors: Object.entries(white).reverse() },
}

export default meta
