import { InfoIcon } from '@status-im/icons/16'

import { InformationBox } from './information-box'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof InformationBox> = {
  title: 'information-box',
  component: InformationBox,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=5187-181408&t=5dgANDld90Qfd00V-0',
    },
  },
}

type Story = StoryObj<typeof InformationBox>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    message: 'This is a simple message.',
  },
}

export const Information: Story = {
  args: {
    ...Default.args,
    variant: 'information',
  },
}

export const Error: Story = {
  args: {
    ...Default.args,
    variant: 'error',
  },
}

export const DefaultWithIcon: Story = {
  args: {
    message: 'This is a simple message with an info icon.',
    icon: <InfoIcon />,
  },
}

export const InformationWithIcon: Story = {
  args: {
    ...DefaultWithIcon.args,
    variant: 'information',
  },
}

export const ErrorWithIcon: Story = {
  args: {
    ...DefaultWithIcon.args,
    variant: 'error',
  },
}

export const WithMaxWidth: Story = {
  args: {
    ...Default.args,
    maxWidth: 256,
  },
}

export const WithIconAndTwoLines: Story = {
  args: {
    ...DefaultWithIcon.args,
    message: 'This is a message with an icon and two lines.',
    maxWidth: 200,
  },
}

export const WithButtonAndIconDefault: Story = {
  args: {
    ...DefaultWithIcon.args,
    message: 'This is a message with an icon and a button.',
    buttonText: 'Button',
    maxWidth: 256,
    onButtonPress: () => alert('clicked'),
  },
}

export const WithButtonAndIconInformation: Story = {
  args: {
    ...WithButtonAndIconDefault.args,
    variant: 'information',
  },
}

export const WithButtonAndIconError: Story = {
  args: {
    ...WithButtonAndIconDefault.args,
    variant: 'error',
  },
}

export const DefaultWithDismiss: Story = {
  args: {
    message: 'This is a simple message.',
    onDismiss: () => alert('dismissed'),
  },
}

export const InformationWithDismiss: Story = {
  args: {
    ...DefaultWithDismiss.args,
    variant: 'information',
  },
}

export const ErrorWithDismiss: Story = {
  args: {
    ...DefaultWithDismiss.args,
    variant: 'error',
  },
}

export const DefaultWithIconAndDismiss: Story = {
  args: {
    message: 'This is a simple message with an info icon.',
    icon: <InfoIcon />,
    onDismiss: () => alert('dismissed'),
  },
}

export const InformationWithIconAndDismiss: Story = {
  args: {
    ...DefaultWithIconAndDismiss.args,
    variant: 'information',
  },
}

export const ErrorWithIconAndDismiss: Story = {
  args: {
    ...DefaultWithIconAndDismiss.args,
    variant: 'error',
  },
}

export const WithButtonAndIconAndDismiss: Story = {
  args: {
    ...WithButtonAndIconDefault.args,
    message: 'This is a message with an icon and a button.',
    buttonText: 'Button',
    maxWidth: 256,
    onButtonPress: () => alert('clicked'),
    onDismiss: () => alert('dismissed'),
  },
}

export const WithButtonAndIconAndDismissInformation: Story = {
  args: {
    ...WithButtonAndIconAndDismiss.args,
    variant: 'information',
  },
}

export const WithButtonAndIconAndDismissError: Story = {
  args: {
    ...WithButtonAndIconAndDismiss.args,
    variant: 'error',
  },
}

export default meta
