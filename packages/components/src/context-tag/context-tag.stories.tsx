import { PlaceholderIcon } from '@status-im/icons/20'

import { ContextTag } from '.'

import type { Meta, StoryObj } from '@storybook/react'

type Props = Pick<React.ComponentPropsWithoutRef<typeof ContextTag>, 'size'>

const ContextTagVariant = (props: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <ContextTag {...props} type="label">
        Name
      </ContextTag>
      <ContextTag
        {...props}
        type="community"
        label="Rarible"
        icon={
          <img
            src="https://avatars.githubusercontent.com/u/64412063?s=200&v=4"
            alt="Rarible"
          />
        }
      />
      <ContextTag
        {...props}
        type="token"
        label="10 ETH"
        icon={
          <img
            src="https://avatars.githubusercontent.com/u/6250754?s=200&v=4"
            alt="Ethereum"
          />
        }
      />
      <ContextTag
        {...props}
        type="network"
        label="Ethereum"
        icon={
          <img
            src="https://avatars.githubusercontent.com/u/6250754?s=200&v=4"
            alt="Ethereum"
          />
        }
      />
      <ContextTag {...props} type="account" label="Account name" emoji="🐷" />
      <ContextTag
        {...props}
        type="icon"
        icon={<PlaceholderIcon />}
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
        <div className="flex flex-col items-start gap-4">
          <ContextTagVariant {...args} size="32" />
          <ContextTagVariant {...args} size="24+" />
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
