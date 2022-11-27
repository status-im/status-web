import React from 'react'

import { Text } from '../../system'

export const Failed = () => {
  return (
    <Text
      size="15"
      color="gray"
      weight="400"
      align="center"
      css={{
        margin: 'auto',
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)',
      }}
    >
      Failed to connect. Try reloading.
    </Text>
  )
}
