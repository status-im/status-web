import * as icons12 from '@status-im/icons/12'
import * as icons16 from '@status-im/icons/16'
import * as icons20 from '@status-im/icons/20'
import * as reactions from '@status-im/icons/reactions'
import * as social from '@status-im/icons/social'

import type { Meta, StoryObj } from '@storybook/react'
import type React from 'react'

function unpascal(str: string) {
  return str.replace(/([A-Z])/g, ' $1').trim()
}

type Args = {
  search: string
  color: string
  icons: [string, React.ComponentType][]
}

const meta: Meta<Args> = {
  title: 'Icons / All',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qLLuMLfpGxK9OfpIavwsmK/Iconset?node-id=3239-987&t=ZG8wYDswtYEV1Per-11',
    },
  },

  args: {
    search: '',
    color: '#000',
  },

  argTypes: {
    icons: {
      table: {
        disable: true,
      },
    },
    color: {
      control: 'color',
    },
  },

  render: ({ search, icons, color }) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
      {icons
        .filter(([key]) =>
          unpascal(key).toLowerCase().includes(search.toLowerCase()),
        )
        .map(([key, Icon]) => (
          <div key={key} className="flex flex-row items-center gap-2.5">
            <div
              className="rounded-6 border border-neutral-10 p-2"
              style={{ color }}
            >
              <Icon />
            </div>
            <span className="whitespace-nowrap text-11 text-neutral-80">
              {unpascal(key).replace(' Icon', '')}
            </span>
          </div>
        ))}
    </div>
  ),
}

type Story = StoryObj<Args>

export const Icons20: Story = {
  name: 'Icons / 20',
  args: { icons: Object.entries(icons20) },
}

export const Icons16: Story = {
  name: 'Icons / 16',
  args: { icons: Object.entries(icons16) },
}

export const Icons12: Story = {
  name: 'Icons / 12',
  args: { icons: Object.entries(icons12) },
}

export const Reactions: Story = {
  args: { icons: Object.entries(reactions) },
}

export const Social: Story = {
  args: { icons: Object.entries(social) },
}

export default meta
