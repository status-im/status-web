import { PlaceholderIcon } from '@status-im/icons/20'
import { action } from '@storybook/addon-actions'

import { Tag } from './tag'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Tag> = {
  component: Tag,
  title: 'Components/Tag',
  args: {
    label: 'Tag',
    disabled: false,
    selected: false,
    icon: <PlaceholderIcon />,
    iconPlacement: 'left',
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=4%3A32&mode=dev',
    },
  },

  render: props => (
    <div className="flex flex-col items-start gap-4">
      <Tag {...props} />
      <Tag {...props} onPress={action('pressed')} selected />
      <Tag {...props} onPress={action('pressed')} disabled />
      <Tag {...props} size="24" />
      <Tag {...props} size="24" onPress={action('pressed')} selected />
      <Tag {...props} size="24" onPress={action('pressed')} disabled />
      <Tag {...props} icon={undefined} />
      <Tag {...props} label={undefined} />
      <Tag {...props} iconPlacement="right" />
      <Tag {...props} onPress={action('pressed')} label="Pressable tag" />
    </div>
  ),
}

type Story = StoryObj<typeof Tag>


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
