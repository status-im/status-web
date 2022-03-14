import React, { cloneElement } from 'react'

import { AccessibleIcon } from '@radix-ui/react-accessible-icon'

type Props = ({ label: string; hide?: false } | { hide: true }) & {
  children: React.ReactElement
}

const Icon = (props: Props) => {
  const { children, hide } = props

  if (hide) {
    return cloneElement(children, {
      'aria-hidden': 'true',
      focusable: 'false',
    })
  }

  return <AccessibleIcon label={props.label}>{children}</AccessibleIcon>
}

export { Icon }
export type { Props as IconProps }
