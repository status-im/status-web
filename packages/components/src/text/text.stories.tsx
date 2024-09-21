import { Text } from './text'

import type { Meta, StoryObj } from '@storybook/react'

type Component = typeof Text

const meta: Meta<Component> = {
  title: 'Components/Text',
  component: Text,
  args: {
    children: 'The quick brown fox jumped over the lazy dog.',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/v98g9ZiaSHYUdKWrbFg9eM/Foundations?node-id=617-208&t=ppNe6QC4ntgNciqw-11',
    },
  },

  render: props => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Text {...props} size={88} weight="regular" />
        <Text {...props} size={88} weight="medium" />
        <Text {...props} size={88} weight="semibold" />
        <Text {...props} size={88} weight="bold" />
      </div>

      <div className="grid gap-2">
        <Text {...props} size={64} weight="regular" />
        <Text {...props} size={64} weight="medium" />
        <Text {...props} size={64} weight="semibold" />
        <Text {...props} size={64} weight="bold" />
      </div>

      <div className="grid gap-2">
        <Text {...props} size={40} weight="regular" />
        <Text {...props} size={40} weight="medium" />
        <Text {...props} size={40} weight="semibold" />
        <Text {...props} size={40} weight="bold" />
      </div>

      <div className="grid gap-2">
        <Text {...props} size={27} weight="regular" />
        <Text {...props} size={27} weight="medium" />
        <Text {...props} size={27} weight="semibold" />
      </div>

      <div className="grid gap-2">
        <Text {...props} size={19} weight="regular" />
        <Text {...props} size={19} weight="medium" />
        <Text {...props} size={19} weight="semibold" />
      </div>

      <div className="grid gap-2">
        <Text {...props} size={15} weight="regular" />
        <Text {...props} size={15} weight="medium" />
        <Text {...props} size={15} weight="semibold" />
      </div>

      <div className="grid gap-2">
        <Text {...props} size={13} weight="regular" />
        <Text {...props} size={13} weight="medium" />
        <Text {...props} size={13} weight="semibold" />
      </div>

      <div className="grid gap-2">
        <Text {...props} size={11} weight="regular" />
        <Text {...props} size={11} weight="medium" />
        <Text {...props} size={11} weight="semibold" />
        <Text {...props} size={11} weight="regular" uppercase />
        <Text {...props} size={11} weight="medium" uppercase />
        <Text {...props} size={11} weight="semibold" uppercase />
      </div>
    </div>
  ),
}

type Story = StoryObj<Component>

export const Light: Story = {
  args: {},
}

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export default meta
