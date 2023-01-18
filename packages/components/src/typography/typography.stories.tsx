import { Stack } from '@tamagui/core'

import { Code, Heading, Paragraph } from '.'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'typography',
  argTypes: {},
}

export const HeadingStory: StoryObj<typeof Heading> = {
  name: 'Heading',
  args: {
    children: 'The quick brown fox jumped over the lazy dog.',
  },
  render: args => (
    <Stack>
      <Heading {...args} weight="regular" />
      <Heading {...args} weight="medium" />
      <Heading {...args} weight="semibold" />
      <Heading {...args} weight="regular" heading="h2" />
      <Heading {...args} weight="medium" heading="h2" />
      <Heading {...args} weight="semibold" heading="h2" />
    </Stack>
  ),
}

export const TextStory: StoryObj<typeof Paragraph> = {
  name: 'Text',
  args: {
    children: 'The quick brown fox jumped over the lazy dog.',
  },
  render: args => (
    <Stack>
      <Paragraph {...args} weight="regular" />
      <Paragraph {...args} weight="medium" />
      <Paragraph {...args} weight="semibold" />
      <Paragraph {...args} weight="regular" variant="smaller" />
      <Paragraph {...args} weight="medium" variant="smaller" />
      <Paragraph {...args} weight="semibold" variant="smaller" />
    </Stack>
  ),
}

export const CodeStory: StoryObj<typeof Code> = {
  name: 'Code',
  args: {
    children: '// How to create variables:',
  },
  render: () => (
    <Stack>
      <Code weight="regular">
        The quick brown fox jumped over the lazy dog.
      </Code>
    </Stack>
  ),
}

export default meta
