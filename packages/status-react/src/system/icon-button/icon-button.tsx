import React, { forwardRef } from 'react'

import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { Link } from 'react-router-dom'

import { Base } from './styles'

import type { Variants } from './styles'
import type { Ref } from 'react'
import type { LinkProps } from 'react-router-dom'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

interface Props {
  label: string
  children: React.ReactElement
  type?: ButtonProps['type']
  onClick?: ButtonProps['onClick']
  intent?: Variants['intent']
  color?: Variants['color']
  active?: boolean
  to?: LinkProps['to']
}

const IconButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    label,
    children,
    type = 'button',
    onClick,
    intent,
    color,
    active,
    to,
    ...buttonProps
  } = props

  if (to) {
    return (
      <Base
        as={Link}
        to={to}
        aria-label={label}
        intent={intent}
        color={color}
        active={active}
      >
        {children}
      </Base>
    )
  }

  return (
    <Base
      {...buttonProps}
      type={type}
      ref={ref}
      aria-label={label}
      onClick={onClick}
      intent={intent}
      color={color}
      active={active}
    >
      <AccessibleIcon label={label}>{children}</AccessibleIcon>
    </Base>
  )
}

const _IconButton = forwardRef(IconButton)

export { _IconButton as IconButton }
export type { Props as IconButtonProps }
