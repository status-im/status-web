import { createElement, memo, useState } from 'react'

import {
  BuyIcon,
  DarkIcon,
  DesktopIcon,
  GasIcon,
  LightIcon,
  ProfileIcon,
} from '@status-im/icons/20'
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
    const textData = [
      { value: 'option-a', label: 'Option A' },
      { value: 'option-b', label: 'Option B' },
      { value: 'option-c', label: 'Option C' },
    ]

    const iconData = [
      { value: 'buy', label: 'Buy', icon: BuyIcon },
      { value: 'gas', label: 'Gas', icon: GasIcon },
      { value: 'profile', label: 'Profile', icon: ProfileIcon },
    ]

    const themeSelectorData = [
      { value: 'system', icon: DesktopIcon },
      { value: 'light', icon: LightIcon },
      { value: 'dark', icon: DarkIcon },
    ]

    const emojiData = [
      { value: 'apple', label: 'Apple', emoji: '🍎' },
      { value: 'orange', label: 'Orange', emoji: '🍊' },
      { value: 'grapes', label: 'Grapes', emoji: '🍇' },
    ]
    return (
      <div className="inline-flex flex-col gap-4">
        <p className="text-27 dark:text-white-100">Segmented Control</p>
        {/* Only text */}
        <SegmentedControlVariant {...args} data={textData} />
        <SegmentedControlVariant {...args} size="24" data={textData} />
        <SegmentedControlVariant {...args} type="dark-grey" data={textData} />
        <SegmentedControlVariant
          {...args}
          type="dark-grey"
          size="24"
          data={textData}
        />

        {/* Only icon */}
        <SegmentedControlVariant
          {...args}
          variant="icon-only"
          data={iconData}
        />
        <SegmentedControlVariant
          {...args}
          variant="icon-only"
          size="24"
          data={iconData}
        />
        <SegmentedControlVariant
          {...args}
          variant="icon-only"
          type="dark-grey"
          data={iconData}
        />
        <SegmentedControlVariant
          {...args}
          variant="icon-only"
          type="dark-grey"
          size="24"
          data={iconData}
        />

        {/* Only emoji */}
        <SegmentedControlVariant
          {...args}
          variant="emoji-only"
          data={emojiData}
        />
        <SegmentedControlVariant
          {...args}
          variant="emoji-only"
          size="24"
          data={emojiData}
        />
        <SegmentedControlVariant
          {...args}
          variant="emoji-only"
          type="dark-grey"
          data={emojiData}
        />
        <SegmentedControlVariant
          {...args}
          variant="emoji-only"
          type="dark-grey"
          size="24"
          data={emojiData}
        />

        {/* Icon and text */}
        <SegmentedControlVariant
          {...args}
          variant="icon-text"
          data={iconData}
        />
        <SegmentedControlVariant
          {...args}
          size="24"
          variant="icon-text"
          data={iconData}
        />
        <SegmentedControlVariant
          {...args}
          type="dark-grey"
          variant="icon-text"
          data={iconData}
        />
        <SegmentedControlVariant
          {...args}
          type="dark-grey"
          size="24"
          variant="icon-text"
          data={iconData}
        />

        {/* Emoji and text */}
        <SegmentedControlVariant
          {...args}
          variant="emoji-text"
          data={emojiData}
        />
        <SegmentedControlVariant
          {...args}
          size="24"
          variant="emoji-text"
          data={emojiData}
        />
        <SegmentedControlVariant
          {...args}
          type="dark-grey"
          variant="emoji-text"
          data={emojiData}
        />
        <SegmentedControlVariant
          {...args}
          type="dark-grey"
          size="24"
          variant="emoji-text"
          data={emojiData}
        />

        <div className="gap-4 pt-4">
          <p className="text-27 dark:text-white-100">Theme Selector</p>
          <div className="inline-flex pt-4">
            <SegmentedControlVariant
              {...args}
              variant="icon-only"
              data={themeSelectorData}
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
