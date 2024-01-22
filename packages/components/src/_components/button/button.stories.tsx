import {
  AlertIcon,
  PinIcon,
  PlaceholderIcon,
  RecentIcon,
} from '@status-im/icons'
import { Stack } from '@tamagui/core'

import { Button } from './button'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  component: Button,
  title: 'Components/Button',
  args: {
    children: 'Button',
    // size: '40',
    isDisabled: false,
  },
  argTypes: {
    // size: {
    //   options: ['40', '32', '24'],
    //   defaultValue: '40',
    //   control: {
    //     type: 'radio',
    //   },
    // },
    // size: {},
  },
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=4%3A32&mode=dev',
    },
  },

  // argTypes: {
  //   children: {
  //     defaultValue: 'Button',
  //     control: 'text',
  //   },
  //   disabled: {
  //     control: 'boolean',
  //     defaultValue: false,
  //   },
  // },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

// export const Full: Story = {
//   args: {
//     icon: PinIcon,
//     children: 'Banner message',
//     count: 5,
//   },
// }

// export const NoIcon: Story = {
//   args: {
//     children: 'Banner message',
//     count: 5,
//   },
// }

// export const NoCount: Story = {
//   args: {
//     icon: PinIcon,
//     children: 'Banner message',
//   },
// }

// export const NetworkStateConnecting: Story = {
//   args: {
//     icon: RecentIcon,
//     variant: 'neutral',
//     children: 'Connecting...',
//   },
// }

// export const NetworkStateError: Story = {
//   args: {
//     icon: AlertIcon,
//     variant: 'danger',
//     children: 'Network is down',
//   },
// }

const sizes = ['40', '32', '24'] as const

const renderVariant = (variant: string) => (props: Story['args']) =>
  (
    <div className="flex items-center gap-4">
      {sizes.map(size => (
        <Button
          key={size}
          {...props}
          iconBefore={PinIcon}
          iconAfter={PinIcon}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  )

export const AllVariants: Story = {
  args: {},
  render: props => (
    <div className="grid gap-4">
      {renderVariant('primary')(props)}
      {renderVariant('positive')(props)}
      {renderVariant('grey')(props)}
      {renderVariant('darkGrey')(props)}
      {renderVariant('outline')(props)}
      {renderVariant('ghost')(props)}
      {renderVariant('danger')(props)}
    </div>

    // <div className="text-neutral-100">
    //   <div className="flex flex-co gap-2">
    //     NORMAL
    //     {(
    //       [
    //         'customisation',
    //         // 'positive',
    //         // 'grey',
    //         // 'darkGrey',
    //         // 'outline',
    //         // 'ghost',
    //         // 'danger',
    //       ] as const
    //     ).map(variant => (
    //       <Button key={variant} variant={variant} {...props} />
    //     ))}
    //   </div>
    //   <div className="blurry grid gap-2" data-background="blur">
    //     NORMAL BLURED
    //     {(
    //       [
    //         'customisation',
    //         // 'positive',
    //         // 'grey',
    //         // 'darkGrey',
    //         // 'outline',
    //         // 'ghost',
    //         // 'danger',
    //       ] as const
    //     ).map(variant => (
    //       <Button key={variant} variant={variant} {...props} />
    //     ))}
    //   </div>
    //   <div className="dark grid gap-2">
    //     DARK
    //     {(
    //       [
    //         'customisation',
    //         // 'positive',
    //         // 'grey',
    //         // 'darkGrey',
    //         // 'outline',
    //         // 'ghost',
    //         // 'danger',
    //       ] as const
    //     ).map(variant => (
    //       <Button key={variant} variant={variant} {...props} />
    //     ))}
    //   </div>
    //   <div className="dark grid gap-2" data-background="blur">
    //     DARK BLUR
    //     {(
    //       [
    //         'customisation',
    //         // 'positive',
    //         // 'grey',
    //         // 'darkGrey',
    //         // 'outline',
    //         // 'ghost',
    //         // 'danger',
    //       ] as const
    //     ).map(variant => (
    //       <Button key={variant} variant={variant} {...props} />
    //     ))}
    //   </div>
    // </div>
  ),
}

export default meta
