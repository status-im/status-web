import React from 'react'

import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

interface Props {
  label: string
  children: React.ReactNode
}

const Icon = (props: Props) => {
  const { label, children } = props
  return <AccessibleIcon label={label}>{children}</AccessibleIcon>
}

export { Icon }
export type { Props as IconProps }
