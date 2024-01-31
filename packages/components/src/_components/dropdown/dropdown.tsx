import { forwardRef } from 'react'

import { DropdownIcon } from '@status-im/icons'

import { Button } from '../button'

import type { ButtonProps } from '../button'
import type { Ref } from 'react'
import type { ButtonProps as AriaButtonProps } from 'react-aria-components'

type Props = AriaButtonProps & {
  children: string
  size?: ButtonProps['size']
  variant?: Extract<
    ButtonProps['variant'],
    'primary' | 'gray' | 'outline' | 'ghost'
  >
}

const DropdownButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const { size = '40', variant = 'primary', children, ...buttonProps } = props

  return (
    <Button
      {...buttonProps}
      ref={ref}
      size={size}
      variant={variant}
      iconAfter={DropdownIcon}
    >
      {children}
    </Button>
  )
}

const _DropdownButton = forwardRef(DropdownButton)

export { _DropdownButton as DropdownButton }
export type { Props as DropdownButtonProps }
