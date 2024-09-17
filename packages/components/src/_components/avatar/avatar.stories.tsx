import { PlaceholderIcon } from '@status-im/icons/20'

import { Avatar } from './avatar'

import type { AvatarProps } from './avatar'
import type { Meta, StoryObj } from '@storybook/react'

const sizes = ['80', '56', '48', '32', '28', '24', '20', '16'] as const

const renderVariant = (variant: AvatarProps['type']) => (props: any) => (
  <div className="flex items-center gap-4">
    {sizes.map(size => (
      <div key={size} style={{ width: `${size}px`, height: `${size}px` }}>
        <Avatar {...props} type={variant} size={size} />
      </div>
    ))}
  </div>
)

const meta = {
  component: Avatar,
  title: 'Components/Avatar',
  args: {
    name: 'John Doe',
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    // indicator: 'online',
    colorHash: [
      [3, 30],
      [2, 10],
      [5, 5],
      [3, 14],
      [5, 4],
      [4, 19],
      [3, 16],
      [4, 0],
      [5, 28],
      [4, 13],
      [4, 15],
    ],
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=102-5246&t=i4haPXGOeNtaLaEz-0',
    },
  },

  render: props => (
    <div className="grid gap-4">
      {renderVariant('user')(props)}
      {/* {renderVariant('group')(props)} */}
      {/* {renderVariant('wallet')(props)} */}
      {/* {renderVariant('account')(props)} */}
      {renderVariant('community')(props)}
      {renderVariant('channel')({ ...props, emoji: '🍑' })}
      {renderVariant('icon')({ ...props, icon: PlaceholderIcon })}
    </div>
  ),
} satisfies Meta<typeof Avatar>

type Story = StoryObj<typeof Avatar>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
