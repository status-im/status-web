import { action } from '@storybook/addon-actions'

import { Reply } from './reply'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Reply> = {
  component: Reply,
  argTypes: {},
  args: {
    name: 'Alisher Yakupov',
    src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixid=Mnw0MDAxMTJ8MHwxfHNlYXJjaHw0fHxhdmF0YXJ8ZW58MHx8fHwxNjc1MjU4NTkw&ixlib=rb-4.0.3',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=3173%3A55936&t=QgRAQPXVREVsrDg7-11',
    },
  },
}

type Story = StoryObj<typeof Reply>

export const Text: Story = {
  args: {
    type: 'text',
    onClose: undefined,
  },
}

export const TextClose: Story = {
  name: 'Text + Close',
  args: {
    ...Text.args,
    onClose: action('close'),
  },
}

export const Image: Story = {
  args: {
    type: 'image',
    onClose: undefined,
  },
}

export const ImageClose: Story = {
  name: 'Image + Close',
  args: {
    ...Image.args,
    onClose: action('close'),
  },
}

export const GIF: Story = {
  args: {
    type: 'gif',
    onClose: undefined,
  },
}

export const GIFClose: Story = {
  name: 'GIF + Close',
  args: {
    ...GIF.args,
    onClose: action('close'),
  },
}

export const Deleted: Story = {
  args: {
    type: 'deleted',
    onClose: undefined,
  },
}

export const DeletedClose: Story = {
  name: 'Deleted + Close',
  args: {
    type: 'deleted',
    onClose: action('close'),
  },
}

export default meta
