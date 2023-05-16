import { useState } from 'react'

import { Stack } from '@tamagui/core'

import { CaptureButton } from './capture-button'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof CaptureButton> = {
  component: CaptureButton,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qSIh8wh9EVdY8S2sZce15n/Composer-for-Web?node-id=7131%3A360528&t=11hKj5jyWVroXgdu-4',
    },
  },
  decorators: [
    Story => {
      const [isRecording, setIsRecording] = useState(false)

      const handleOnPress = () => {
        setIsRecording(!isRecording)
      }

      return (
        <Story
          args={{
            onPress: handleOnPress,
            isRecording,
          }}
        />
      )
    },
  ],
}

type Story = StoryObj<typeof CaptureButton>

export const Default: Story = {
  name: 'CaptureButton',
  render: args => {
    return (
      <Stack margin={40}>
        <CaptureButton {...args} />
      </Stack>
    )
  },
}

export default meta
