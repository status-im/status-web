import { useEffect, useRef, useState } from 'react'

import { SearchIcon } from '@status-im/icons'

import { Input } from './input'

import type { Meta, StoryObj } from '@storybook/react'
import type { TextInput } from 'react-native'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Input> = {
  component: Input,
  argTypes: {},
}

type Story = StoryObj<typeof Input>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    placeholder: 'Type something...',
    // children: 'Click me',
  },
}

const InputSearch = () => {
  const [value, setValue] = useState('')

  // limit input to 100 characters just for demo purposes
  useEffect(() => {
    if (value.length > 100) {
      setValue(value.slice(0, 100))
    }
  }, [value])

  return (
    <>
      <Input
        placeholder="Please type something..."
        value={value}
        onChangeText={setValue}
        icon={<SearchIcon size={20} />}
        onClear={() => setValue('')}
        label="Search"
        endLabel={`${value.length}/100`}
        size={40}
        button={{
          label: 'Confirm',
          onPress: () => alert('Confirmed!'),
        }}
      />
    </>
  )
}

const InputSearchMinimzed = () => {
  const [value, setValue] = useState('')

  const [isMinimized, setIsMinimized] = useState(true)
  const inputRef = useRef<TextInput>(null)

  return (
    <>
      <Input
        onHandleMinimized={() => setIsMinimized(!isMinimized)}
        placeholder="Please type something..."
        value={value}
        onChangeText={setValue}
        icon={<SearchIcon size={20} />}
        onClear={() => setValue('')}
        size={32}
        direction="rtl"
        minimized={isMinimized}
        ref={inputRef}
      />
    </>
  )
}

export const Minimized: Story = {
  render: () => <InputSearchMinimzed />,
}

export const CompleteExample: Story = {
  render: () => <InputSearch />,
}

export const WithError: Story = {
  args: {
    placeholder: 'Type something...',
    error: true,
    // children: 'Click me',
  },
}

export default meta
