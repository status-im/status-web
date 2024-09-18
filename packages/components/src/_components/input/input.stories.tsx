import { EmailIcon } from '@status-im/icons/20'

import { Input } from './input'

import type { Meta, StoryObj } from '@storybook/react'

type Component = typeof Input

const meta: Meta<Component> = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Type something...',
  },

  render: props => (
    <div className="flex w-[300px] flex-col gap-3">
      <h3 className="mb-2 text-15 font-medium">Basic Inputs</h3>
      <Input {...props} />
      <Input {...props} size="32" />

      <h3 className="mb-2 mt-4 text-15 font-medium">Inputs with Icon</h3>
      <Input {...props} icon={<EmailIcon />} />
      <Input {...props} icon={<EmailIcon />} size="32" />

      <h3 className="mb-2 mt-4 text-15 font-medium">Clearable Inputs</h3>
      <Input {...props} clearable />
      <Input {...props} clearable size="32" />

      <h3 className="mb-2 mt-4 text-15 font-medium">
        Inputs with Icon and Clearable
      </h3>
      <Input {...props} icon={<EmailIcon />} clearable />
      <Input {...props} icon={<EmailIcon />} clearable size="32" />

      <h3 className="mb-2 mt-4 text-15 font-medium">Special States</h3>
      <Input {...props} isDisabled />
      <Input {...props} isInvalid />

      <h3 className="mb-2 mt-4 text-15 font-medium">
        Inputs with Label and Meta
      </h3>
      <Input {...props} label="Label" />
      <Input {...props} maxLength={280} />
      <Input {...props} label="Label" maxLength={280} />

      <h3 className="mb-2 mt-4 text-15 font-medium">Complex Inputs</h3>
      <Input {...props} label="Label" maxLength={280} icon={<EmailIcon />} />
      <Input
        {...props}
        label="Label"
        maxLength={280}
        icon={<EmailIcon />}
        clearable
      />
      <Input
        {...props}
        label="Label"
        maxLength={280}
        icon={<EmailIcon />}
        clearable
        size="32"
      />
    </div>
  ),
}

type Story = StoryObj<Component>

export const Light: Story = {
  args: {},
}

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export default meta
