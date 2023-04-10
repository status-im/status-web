import { Carousel } from './carousel'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Carousel> = {
  title: 'carousel',
  component: Carousel,
  args: {},
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=611%3A36006&t=Gyy71OAckl3b2TWj-4',
    },
  },
}

type Story = StoryObj<typeof Carousel>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args

export const Default: Story = {
  name: 'One Image',
  args: {
    images: [
      'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
    ],
  },
}

export const SixImages: Story = {
  name: 'Six Images',
  args: {
    images: [
      'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80',
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80',
      'https://images.unsplash.com/photo-1570126688035-1e6adbd61053?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=974&q=80',
      'https://images.unsplash.com/photo-1677764110182-6fcbec19f41b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80',
      'https://images.unsplash.com/photo-1679662826484-6d3e3a97890a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2371&q=80',
    ],
  },
}

export default meta
