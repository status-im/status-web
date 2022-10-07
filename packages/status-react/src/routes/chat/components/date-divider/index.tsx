import React from 'react'

import isSameDay from 'date-fns/isSameDay'

import { Flex, Text } from '../../../../system'

interface Props {
  date: Date
}

export const DateDivider = (props: Props) => {
  const { date } = props

  let label = date.toLocaleDateString([], { weekday: 'long' })

  const today = new Date()
  const yesterday = new Date().setDate(today.getDate() - 1)

  if (isSameDay(date, today)) {
    label = 'Today'
  } else if (isSameDay(date, yesterday)) {
    label = 'Yesterday'
  }

  return (
    <Flex justify="center" css={{ padding: '18px 0 8px' }}>
      <Text size="13" color="gray">
        {label}
      </Text>
    </Flex>
  )
}
