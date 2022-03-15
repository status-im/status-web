import React from 'react'

import { Root } from '@radix-ui/react-visually-hidden'

type Props = {
  children: React.ReactNode
}

const VisuallyHidden = (props: Props) => {
  const { children } = props

  return <Root>{children}</Root>
}

export { VisuallyHidden }
export type { Props as VisuallyHiddenProps }
