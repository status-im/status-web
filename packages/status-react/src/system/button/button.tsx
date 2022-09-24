import React, { forwardRef } from 'react'

import { Base } from './styles'

import type { Variants } from './styles'
import type { Ref } from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

interface Props {
  children: string
  disabled?: boolean
  loading?: boolean
  active?: boolean
  type?: ButtonProps['type']
  onClick?: ButtonProps['onClick']
  variant?: Variants['variant']
  size?: Variants['size']
}

const Button = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    type = 'button',
    children,
    disabled,
    loading,
    onClick,
    variant = 'default',
    ...buttonProps
  } = props

  return (
    <Base
      {...buttonProps}
      type={type}
      ref={ref}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      variant={variant}
    >
      {children}
    </Base>
  )
}

const _Button = forwardRef(Button)

export { _Button as Button }
export type { Props as ButtonProps }
