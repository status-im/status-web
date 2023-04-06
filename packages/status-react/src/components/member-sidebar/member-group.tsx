import { Text } from '../../system'

import type React from 'react'

interface Props {
  label: string
  children: React.ReactElement[] | React.ReactElement
}

export const MemberGroup = (props: Props) => {
  const { label, children } = props

  return (
    <div>
      <Text size={12} color="gray">
        {label}
      </Text>
      {children}
    </div>
  )
}
