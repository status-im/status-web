import React, { forwardRef } from 'react'

import { Base } from './styles'

import type { Variants } from './styles'
import type { Ref } from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

type Props = (AnchorProps | ButtonProps) & {
  children: string
  variant?: Variants['variant']
  size?: Variants['size']
  disabled?: boolean
}

const Button = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const { children } = props

  if ('href' in props) {
    const { href, ...linkProps } = props
    const external = href.startsWith('http')

    return (
      <Base
        {...linkProps}
        as="a"
        href={props.href}
        {...(external && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
      >
        {children}
      </Base>
    )
  }

  const { type = 'button', loading, ...buttonProps } = props

  return (
    <Base {...buttonProps} type={type} ref={ref} loading={loading}>
      {children}
    </Base>
  )
}

const _Button = forwardRef(Button)

export { _Button as Button }
export type { Props as ButtonProps }
