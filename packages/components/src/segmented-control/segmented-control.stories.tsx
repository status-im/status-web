import { useState } from 'react'

import { PlaceholderIcon } from '@status-im/icons/20'

import { SegmentedControl } from './'

import type { Meta, StoryObj } from '@storybook/react'

type RootProps = React.ComponentPropsWithoutRef<typeof SegmentedControl.Root>
type ItemProps = React.ComponentPropsWithoutRef<typeof SegmentedControl.Item>

const SegmentedControlVariant = (
  props: Omit<ItemProps, 'value'> & {
    count: number
    size: RootProps['size']
    variant: RootProps['variant']
  },
) => {
  const [value, setValue] = useState('0')

  const { count, variant, size, ...itemProps } = props

  return (
    <SegmentedControl.Root
      value={value}
      onValueChange={setValue}
      variant={variant}
      size={size}
    >
      {Array(count)
        .fill(null)
        .map((_, index) => {
          return (
            <SegmentedControl.Item
              {...(itemProps as ItemProps)}
              key={index}
              value={index.toString()}
            />
          )
        })}
    </SegmentedControl.Root>
  )
}

const SegmentedControlGroup = (
  props: Omit<RootProps, 'value' | 'onValueChange'>,
) => {
  const { variant = 'grey' } = props

  return (
    <div className="inline-flex flex-col gap-12">
      <div className="flex flex-col gap-6">
        <SegmentedControlVariant count={5} size="32" variant={variant}>
          Tab
        </SegmentedControlVariant>

        <SegmentedControlVariant
          count={5}
          size="32"
          variant={variant}
          icon={<PlaceholderIcon />}
        >
          Tab
        </SegmentedControlVariant>

        <SegmentedControlVariant count={2} size="32" variant={variant}>
          Tab
        </SegmentedControlVariant>
        <SegmentedControlVariant
          count={2}
          size="32"
          variant={variant}
          icon={<PlaceholderIcon />}
        >
          Tab
        </SegmentedControlVariant>

        <SegmentedControlVariant
          count={5}
          size="32"
          variant={variant}
          icon={<PlaceholderIcon />}
          aria-label="placeholder"
        />
      </div>
    </div>
  )
}

const meta: Meta = {
  title: 'Components/Segmented Control',
  render: args => {
    return (
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-wrap gap-5">
          <div className="rounded-[24px] bg-white-100 p-12 dark:bg-neutral-90">
            <SegmentedControlGroup {...args} />
          </div>

          <div className="inline-flex flex-col gap-12 rounded-[24px] bg-neutral-5 p-12 dark:bg-neutral-95">
            <SegmentedControlGroup {...args} variant="darkGrey" />
          </div>

          <div
            data-background="blur"
            className="relative inline-flex flex-col gap-12 overflow-hidden rounded-[24px] p-12"
          >
            <div className="absolute left-0 top-0 z-10 size-full bg-blur-white/70 backdrop-blur-[20px] dark:bg-blur-neutral-80/80" />
            {/* Background image */}
            <div className="absolute left-0 top-0 size-full bg-[url(./assets/background-blur.png)] bg-cover bg-center bg-no-repeat" />
            <div className="relative z-10">
              <SegmentedControlGroup {...args} />
            </div>
          </div>
        </div>
      </div>
    )
  },
}

type Story = StoryObj

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
