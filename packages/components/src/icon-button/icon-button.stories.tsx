import { BoldIcon } from '@status-im/icons/20'
import { action } from '@storybook/addon-actions'

import { IconButton } from './icon-button'

import type { Meta, StoryObj } from '@storybook/react'

const sizes = ['40', '32', '24'] as const

// eslint-disable-next-line react/display-name
const renderVariant = (variant: string) => (props: any) => (
  <div className="flex items-center gap-4">
    {sizes.map(size => (
      <IconButton
        {...props}
        key={size}
        variant={variant}
        icon={<BoldIcon />}
        onPress={action('press')}
      />
    ))}
  </div>
)

const meta = {
  component: IconButton,
  title: 'Components/Icon Button',
  args: {
    disabled: false,
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=4%3A32&mode=dev',
    },
  },

  render: props => (
    <div className="grid gap-4">
      {renderVariant('default')(props)}
      {renderVariant('outline')(props)}
      {renderVariant('ghost')(props)}
    </div>
  ),
} satisfies Meta<typeof IconButton>

type Story = StoryObj<typeof IconButton>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
