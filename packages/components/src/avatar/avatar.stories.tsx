import { PlaceholderIcon } from '@status-im/icons/20'

import { Avatar } from './avatar'

import type { AvatarProps } from './avatar'
import type { Meta, StoryObj } from '@storybook/react'

const sizesAvatar = {
  user: ['80', '64', '56', '48', '32', '28', '24', '20', '16'],
  community: ['32', '24', '20'],
  channel: ['80', '32', '28', '24', '20'],
  icon: ['48', '32', '20'],
  account: ['80', '48', '32', '28', '24', '20', '16'],
}

const renderVariant = (variant: AvatarProps['type']) => {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const content = (props: any) => {
    const sizes = sizesAvatar[variant]

    return (
      <div className="flex items-center gap-4">
        {sizes.map(size => (
          <div key={size} style={{ width: `${size}px`, height: `${size}px` }}>
            <Avatar {...props} type={variant} size={size} />
          </div>
        ))}
      </div>
    )
  }

  return content
}

const meta = {
  component: Avatar,
  title: 'Components/Avatar',
  args: {
    name: 'John Doe',
    // src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=102-5246&t=i4haPXGOeNtaLaEz-0',
    },
  },

  render: props => (
    <div className="grid gap-4">
      <h1 className="text-19">User Avatar</h1>
      {renderVariant('user')({
        ...props,
        src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
      })}
      <h1 className="text-19">User Avatar with ring</h1>
      {renderVariant('user')({
        ...props,
        src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
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
      })}
      <h1 className="text-19">User Avatar fallback</h1>
      {renderVariant('user')({
        ...props,
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
      })}
      <h1 className="text-19">Community Avatar</h1>
      {renderVariant('community')({
        ...props,
        src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
      })}
      <h1 className="text-19">Channel Avatar</h1>
      {renderVariant('channel')({ ...props, emoji: '🍑' })}
      <h1 className="text-19">Icon Avatar</h1>
      {renderVariant('icon')({ ...props, icon: <PlaceholderIcon /> })}
      <h1 className="text-19">Account Avatar</h1>
      {renderVariant('account')({ ...props, emoji: '🍿' })}
      <h1 className="text-19">Account Avatar with Opacity</h1>
      {renderVariant('account')({ ...props, emoji: '🍿', bgOpacity: '5' })}
      <h1 className="text-19">Account Avatar with Transparent background</h1>
      {renderVariant('account')({ ...props, emoji: '🍿', bgOpacity: '0' })}
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
