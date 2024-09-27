import { useState } from 'react'

import {
  AlphabeticallyIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  ForwardIcon,
  LinkIcon,
  NotificationsIcon,
  PinIcon,
  ReplyIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '@status-im/icons/20'
import { action } from '@storybook/addon-actions'

import { DropdownButton } from '../dropdown-button'
import { DropdownMenu } from '.'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'Components/Dropdown Menu',
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=1931%3A31188&t=rOKELbVkzya48FJE-0',
    },
  },

  render: args => {
    const [isChecked, setIsChecked] = useState(false) // eslint-disable-line react-hooks/rules-of-hooks
    const [isChecked2, setIsChecked2] = useState(false) // eslint-disable-line react-hooks/rules-of-hooks
    return (
      <DropdownMenu.Root {...args}>
        <DropdownButton>Open</DropdownButton>

        <DropdownMenu.Content sideOffset={10}>
          <DropdownMenu.Search placeholder="Search by" />

          <DropdownMenu.Item
            icon={<EditIcon />}
            label="Edit message"
            onSelect={action('edit')}
          />
          <DropdownMenu.Item
            icon={<ReplyIcon />}
            label="Reply"
            onSelect={action('reply')}
          />
          <DropdownMenu.Item
            icon={<CopyIcon />}
            label="Copy text"
            onSelect={action('copy')}
          />
          <DropdownMenu.Item
            icon={<PinIcon />}
            selected
            label="Pin to the channel"
            onSelect={action('pin')}
          />
          <DropdownMenu.Item
            icon={<ForwardIcon />}
            label="Forward"
            onSelect={action('forward')}
          />
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger
              icon={<AlphabeticallyIcon />}
              label="Sub menu"
            />

            <DropdownMenu.SubContent>
              <DropdownMenu.Item
                icon={<ZoomInIcon />}
                label="Zoom In"
                onSelect={action('zoom in')}
                external
              />
              <DropdownMenu.Item
                icon={<ZoomOutIcon />}
                label="Zoom Out"
                onSelect={action('zoom out')}
                external
              />
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Item
            icon={<LinkIcon />}
            label="Share link to message"
            onSelect={action('share')}
          />
          <DropdownMenu.CheckboxItem
            icon={<NotificationsIcon />}
            label="Enable notifications"
            checked={isChecked}
            onCheckedChange={setIsChecked}
            onSelect={e => e.preventDefault()}
          />
          <DropdownMenu.SwitchItem
            icon={<NotificationsIcon />}
            label="Toggle alerts"
            checked={isChecked2}
            onCheckedChange={setIsChecked2}
            onSelect={e => e.preventDefault()}
          />

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            icon={<DeleteIcon />}
            label="Delete message"
            danger
            onSelect={action('delete')}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  },
}

type Story = StoryObj<typeof DropdownMenu>

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export default meta
