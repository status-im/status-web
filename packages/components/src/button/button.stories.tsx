import { PopupIcon } from '@status-im/icons'
import { action } from '@storybook/addon-actions'
import { Stack } from 'tamagui'

import { Button } from './button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  component: Button,
  args: {
    onPress: action('press'),
  },
  argTypes: {
    disabled: {
      defaultValue: false,
    },
  },
  decorators: [
    Story => (
      <Stack alignItems="flex-start">
        <Story />
      </Stack>
    ),
  ],
}

type Story = StoryObj<typeof Button>

const icon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 15.7C11.3398 15.7 12.5717 15.2377 13.5448 14.464L9.88475 10.804L6.43975 14.4516C7.41525 15.2328 8.65306 15.7 10 15.7ZM5.52328 13.5287L8.96514 9.88437L5.53601 6.45524C4.76227 7.42833 4.3 8.66018 4.3 10C4.3 11.3325 4.7572 12.5581 5.52328 13.5287ZM9.85811 8.93887L6.45525 5.536C7.42834 4.76227 8.66018 4.3 10 4.3C11.2156 4.3 12.3423 4.68051 13.2675 5.32892L9.85811 8.93887ZM10.7777 9.85848L14.241 6.19151C15.1481 7.20095 15.7 8.53602 15.7 10C15.7 11.3398 15.2377 12.5717 14.464 13.5448L10.7777 9.85848ZM10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
      fill="white"
    />
  </svg>
)

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Click me',
  },
}

export const PrimaryDisabled: Story = {
  args: {
    children: 'Click me',
    disabled: true,
  },
}

export const Primary32: Story = {
  name: 'Primary / 32',
  args: {
    size: 32,
    children: 'Click me',
  },
}

export const Primary24: Story = {
  name: 'Primary / 24',
  args: {
    size: 24,
    children: 'Click me',
  },
}

export const PrimaryIconBefore: Story = {
  name: 'Primary icon before',
  args: {
    children: 'Click me',
    icon,
  },
}

export const PrimaryIconBeforeDifferentColor: Story = {
  name: 'Primary icon before/Different color',
  args: {
    children: 'Click me',
    icon: <PopupIcon size={20} color="$yellow-50" />,
  },
}

export const PrimaryIconAfter: Story = {
  name: 'Primary/Icon after',
  args: {
    children: 'Click me',
    iconAfter: icon,
  },
}

export const PrimaryIconAfterDifferentColor: Story = {
  name: 'Primary/Icon after/Different color',
  args: {
    children: 'Click me',
    iconAfter: <PopupIcon size={20} color="$yellow-50" />,
  },
}

export const PrimaryIconOnly: Story = {
  name: 'Primary/Icon only',
  args: {
    icon,
  },
}

export const PrimaryIconOnlyCirlce: Story = {
  name: 'Primary/Icon only/Circle',
  args: {
    icon,
    shape: 'circle',
  },
}

export const Success: Story = {
  args: {
    variant: 'positive',
    children: 'Click me',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Click me',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Click me',
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Click me',
  },
}

export default meta
