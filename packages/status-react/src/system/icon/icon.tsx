import React, { cloneElement } from 'react'

import { Root } from '@radix-ui/react-accessible-icon'

type Props = ({ label: string; hidden?: false } | { hidden: true }) & {
  children: React.ReactElement
}

const Icon = (props: Props) => {
  const { children, hidden } = props

  if (hidden) {
    return cloneElement(children, {
      'aria-hidden': 'true',
      focusable: 'false',
    })
  }

  return <Root label={props.label}>{children}</Root>
}

export { Icon }
export type { Props as IconProps }
