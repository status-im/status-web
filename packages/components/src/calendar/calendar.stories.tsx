import { useState } from 'react'

import { Stack } from '@tamagui/core'
import { format } from 'date-fns'

import { Text } from '../text'
import { Calendar } from './calendar'

import type { Meta, StoryObj } from '@storybook/react'
import type { DateRange } from 'react-day-picker'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Calendar> = {
  component: Calendar,
  args: {},
  argTypes: {
    disabled: {
      defaultValue: false,
    },
  },
}

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
type Story = StoryObj<typeof Calendar>

const SingleCalendarWithHooks = () => {
  const [selected, setSelected] = useState<Date>()

  return (
    <>
      <Calendar mode="single" selected={selected} onSelect={setSelected} />
      <Stack pt="$2">
        <Text size={15} color="$neutral-50">
          Selected date: {selected && format(selected, 'do MMM yyyy')}
        </Text>
      </Stack>
    </>
  )
}

const MultipleCalendarWithHooks = () => {
  const [selected, setSelected] = useState<Date[]>()
  return (
    <>
      <Calendar mode="multiple" selected={selected} onSelect={setSelected} />
      <Stack pt="$2">
        <Text size={15} color="$neutral-50">
          Selected dates:{' '}
          {selected?.map(date => format(date, 'do MMM yyyy')).join(', ')}
        </Text>
      </Stack>
    </>
  )
}

const RangeCalendarWithHooks = () => {
  const [selected, setSelected] = useState<DateRange>()

  return (
    <>
      <Calendar mode="range" selected={selected} onSelect={setSelected} />
      <Stack pt="$2">
        <Text size={15} color="$neutral-50">
          Start date: {selected?.from && format(selected.from, 'do MMM yyyy')}
        </Text>
        <Text size={15} color="$neutral-50">
          End Date: {selected?.to && format(selected.to, 'do MMM yyyy')}
        </Text>
      </Stack>
    </>
  )
}

export const SinglePicker: Story = {
  render: () => <SingleCalendarWithHooks />,
}

export const MultiplePicker: Story = {
  render: () => <MultipleCalendarWithHooks />,
}

export const RangePicker: Story = {
  render: () => <RangeCalendarWithHooks />,
}

export default meta
