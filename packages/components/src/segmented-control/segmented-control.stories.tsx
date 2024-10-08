import { createElement, memo, useState } from 'react'

import { PlaceholderIcon } from '@status-im/icons/20'
import { match } from 'ts-pattern'

import { SegmentedControl } from './segmented-control'

import type { Meta, StoryObj } from '@storybook/react'

type Data = {
  value: string
  label?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  emoji?: string
}

const SegmentedControlVariant = memo(
  (
    props: React.ComponentPropsWithoutRef<typeof SegmentedControl.Root> & {
      variant?:
        | 'default'
        | 'icon-text'
        | 'emoji-text'
        | 'icon-only'
        | 'emoji-only'
      data: Data[]
    },
  ) => {
    const [activeSegment, setActiveSegment] = useState(props.data[0].value)

    const { variant = 'default', data, size, type } = props

    return (
      <SegmentedControl.Root
        activeSegment={activeSegment}
        onSegmentChange={setActiveSegment}
        size={size}
        type={type}
      >
        {match(variant)
          .with('icon-text', () =>
            data.map(({ value, icon, label }) => {
              const iconElement = icon ? createElement(icon) : null

              return (
                <SegmentedControl.IconButton
                  icon={iconElement}
                  key={value}
                  value={value}
                >
                  {label}
                </SegmentedControl.IconButton>
              )
            }),
          )
          .with('emoji-text', () =>
            data.map(({ value, emoji, label }) => (
              <SegmentedControl.EmojiButton
                emoji={emoji as string}
                key={value}
                value={value}
              >
                {label}
              </SegmentedControl.EmojiButton>
            )),
          )
          .with('icon-only', () =>
            data.map(({ value, icon }) => {
              const iconElement = icon ? createElement(icon) : null

              return (
                <SegmentedControl.IconButton
                  icon={iconElement}
                  key={value}
                  value={value}
                />
              )
            }),
          )
          .with('emoji-only', () =>
            data.map(({ value, emoji }) => (
              <SegmentedControl.EmojiButton
                emoji={emoji as string}
                key={value}
                value={value}
              />
            )),
          )
          .otherwise(() =>
            data.map(({ value, label }) => (
              <SegmentedControl.Button key={value} value={value}>
                {label}
              </SegmentedControl.Button>
            )),
          )}
      </SegmentedControl.Root>
    )
  },
)

SegmentedControlVariant.displayName = 'SegmentedControlVariant'

const meta = {
  title: 'Components/SegmentedControl',
  render: args => {
    const tabIcon = {
      label: 'Tab',
      icon: PlaceholderIcon,
    }
    const tabText = { label: 'Tab' }
    const tabEmoji = {
      label: 'Tab',
      emoji: '🐷',
    }

    return (
      <div className="flex flex-wrap gap-5">
        <div className="inline-flex flex-col gap-12 rounded-[24px] bg-white-100 p-12 dark:bg-neutral-90">
          <div className="flex flex-col gap-6">
            {/* Only text */}
            <SegmentedControlVariant
              {...args}
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabText,
                  value: `placeholder-tab-grey-32-${index}`,
                }))}
            />

            {/* Emoji and text */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-text"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-grey-32-${index}`,
                }))}
            />

            {/* Icon and text */}
            <SegmentedControlVariant
              {...args}
              variant="icon-text"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-grey-32-${index}`,
                }))}
            />

            {/* Only emoji */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-only"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-only-grey-32-${index}`,
                }))}
            />

            {/* Only icon */}
            <SegmentedControlVariant
              {...args}
              variant="icon-only"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-only-grey-32-${index}`,
                }))}
            />
          </div>

          <div className="flex flex-col gap-6">
            {/* Only text */}
            <SegmentedControlVariant
              {...args}
              size="24"
              data={Array(8)
                .fill(null)
                .map((_, index) => ({
                  ...tabText,
                  value: `placeholder-tab-grey-24-${index}`,
                }))}
            />

            {/* Emoji and text */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-text"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-grey-24-${index}`,
                }))}
            />

            {/* Icon and text */}
            <SegmentedControlVariant
              {...args}
              variant="icon-text"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-grey-24-${index}`,
                }))}
            />

            {/* Only emoji */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-only"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-only-grey-24-${index}`,
                }))}
            />

            {/* Only icon */}
            <SegmentedControlVariant
              {...args}
              variant="icon-only"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-only-grey-24-${index}`,
                }))}
            />
          </div>
        </div>
        {/* dark grey light */}
        <div className="inline-flex flex-col gap-12 rounded-[24px] bg-neutral-5 p-12 dark:bg-neutral-95">
          <div className="flex flex-col gap-6">
            {/* Only text */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabText,
                  value: `placeholder-tab-dark-grey-32-${index}`,
                }))}
            />

            {/* Emoji and text */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="emoji-text"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-dark-grey-32-${index}`,
                }))}
            />

            {/* Icon and text */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="icon-text"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-dark-grey-32-${index}`,
                }))}
            />

            {/* Only emoji */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="emoji-only"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-only-dark-grey-32-${index}`,
                }))}
            />

            {/* Only icon */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="icon-only"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-only-dark-grey-32-${index}`,
                }))}
            />
          </div>

          <div className="flex flex-col gap-6">
            {/* Only text */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              size="24"
              data={Array(8)
                .fill(null)
                .map((_, index) => ({
                  ...tabText,
                  value: `placeholder-tab-dark-grey-24-${index}`,
                }))}
            />

            {/* Emoji and text */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="emoji-text"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-dark-grey-24-${index}`,
                }))}
            />

            {/* Icon and text */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="icon-text"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-dark-grey-24-${index}`,
                }))}
            />

            {/* Only emoji */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="emoji-only"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-only-dark-grey-24-${index}`,
                }))}
            />

            {/* Only icon */}
            <SegmentedControlVariant
              {...args}
              type="dark-grey"
              variant="icon-only"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-only-dark-grey-24-${index}`,
                }))}
            />
          </div>
        </div>
        {/* with blur */}
        <div
          data-background="blur"
          className="relative inline-flex flex-col gap-12 overflow-hidden rounded-[24px] p-12"
        >
          <div className="absolute left-0 top-0 z-10 size-full bg-blur-white/70 backdrop-blur-[20px] dark:bg-blur-neutral-80/80" />
          {/* Background image */}
          <div className="absolute left-0 top-0 size-full bg-[url(./assets/background-blur.png)] bg-cover bg-center bg-no-repeat" />
          <div className="relative z-10 flex flex-col gap-6">
            {/* Only text */}
            <SegmentedControlVariant
              {...args}
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabText,
                  value: `placeholder-tab-dark-grey-32-blur-${index}`,
                }))}
            />

            {/* Emoji and text */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-text"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-dark-grey-32-blur-${index}`,
                }))}
            />

            {/* Icon and text */}
            <SegmentedControlVariant
              {...args}
              variant="icon-text"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-dark-grey-32-blur-${index}`,
                }))}
            />

            {/* Only emoji */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-only"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-only-dark-grey-32-blur-${index}`,
                }))}
            />

            {/* Only icon */}
            <SegmentedControlVariant
              {...args}
              variant="icon-only"
              data={Array(2)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-only-dark-grey-32-blur-${index}`,
                }))}
            />
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            {/* Only text */}
            <SegmentedControlVariant
              {...args}
              size="24"
              data={Array(8)
                .fill(null)
                .map((_, index) => ({
                  ...tabText,
                  value: `placeholder-tab-dark-grey-24-blur-${index}`,
                }))}
            />

            {/* Emoji and text */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-text"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-dark-grey-24-blur-${index}`,
                }))}
            />

            {/* Icon and text */}
            <SegmentedControlVariant
              {...args}
              variant="icon-text"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-dark-grey-24-blur-${index}`,
                }))}
            />

            {/* Only emoji */}
            <SegmentedControlVariant
              {...args}
              variant="emoji-only"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabEmoji,
                  value: `placeholder-tab-emoji-only-dark-grey-24-blur-${index}`,
                }))}
            />

            {/* Only icon */}
            <SegmentedControlVariant
              {...args}
              variant="icon-only"
              size="24"
              data={Array(5)
                .fill(null)
                .map((_, index) => ({
                  ...tabIcon,
                  value: `placeholder-tab-icon-only-dark-grey-24-blur-${index}`,
                }))}
            />
          </div>
        </div>
      </div>
    )
  },
} satisfies Meta<typeof SegmentedControl.Root>

type Story = StoryObj

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
