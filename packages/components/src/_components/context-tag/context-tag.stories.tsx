import { PlaceholderIcon } from '@status-im/icons/20'

import { ContextTag } from './'

import type { Meta, StoryObj } from '@storybook/react'

type Props = Extract<
  React.ComponentPropsWithoutRef<typeof ContextTag>,
  { size: '20' }
>

const ContextTagVariant = (props: { size: '20' | '24' | '32' }) => {
  return (
    <div className="flex flex-col gap-2">
      <ContextTag type="label" size="24" textSize="13">
        Name
      </ContextTag>
      <ContextTag
        type="community"
        label="Rarible"
        size="24"
        textSize="13"
        icon={
          <img
            src="https://avatars.githubusercontent.com/u/64412063?s=200&v=4"
            alt="Rarible"
          />
        }
      />
      <ContextTag
        type="token"
        label="10 ETH"
        size="24"
        textSize="13"
        icon={
          <img
            src="https://avatars.githubusercontent.com/u/6250754?s=200&v=4"
            alt="Ethereum"
          />
        }
      />
      <ContextTag
        type="network"
        size="24"
        textSize="13"
        label="Ethereum"
        icon={
          <img
            src="https://avatars.githubusercontent.com/u/6250754?s=200&v=4"
            alt="Ethereum"
          />
        }
      />
      <ContextTag
        type="icon"
        icon={<PlaceholderIcon />}
        size="24"
        textSize="13"
        label="Context"
      />
    </div>
  )
}

const meta: Meta = {
  title: 'Components/Context Tag',
  component: ContextTag,

  render: args => {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-2">
          <ContextTagVariant {...args} size="32" />
          <ContextTagVariant {...args} size="24" />
          <ContextTagVariant {...args} size="20" />
          {/* <ContextTagVariant {...args} size="24" />
          <ContextTagVariant {...args} size="32" /> */}
        </div>
      </div>
    )
  },
}

export default meta

type Story = StoryObj

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
