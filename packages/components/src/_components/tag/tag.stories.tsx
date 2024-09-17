import { PlaceholderIcon } from '@status-im/icons/20'

import { Tag } from './tag'

import type { Meta, StoryObj } from '@storybook/react'

const sizes = ['32', '24'] as const

// eslint-disable-next-line react/display-name
const renderVariant = (selected: boolean) => (props: any) => (
  <div className="flex items-center gap-4">
    {sizes.map(size => (
      <Tag key={size} {...props} selected={selected} size={size} />
    ))}
  </div>
)

const meta = {
  component: Tag,
  title: 'Components/Tag',
  args: {
    label: 'Tag',
    disabled: false,
    icon: PlaceholderIcon,
    iconPlacement: 'left',
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=4%3A32&mode=dev',
    },
  },

  render: props => (
    <div className="grid gap-4">
      {renderVariant(false)(props)}
      {renderVariant(true)(props)}
    </div>
  ),
} satisfies Meta<typeof Tag>

type Story = StoryObj<typeof Tag>

export const Light: Story = {}

// export const IconOnly: Story = {
//   args: {
//     label: undefined,
//   },
// }

// export const RightIcon: Story = {
//   args: {
//     iconPlacement: 'right',
//   },
// }

// export const Disabled: Story = {
//   args: {
//     disabled: true,
//   },
// }

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
