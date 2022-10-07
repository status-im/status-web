import React from 'react'

import { Text } from '../text'
import { Base } from './styles'

import type { Variants } from './styles'
import type Stitches from '@stitches/react'

interface Props {
  children: number
  variant?: Variants['variant']
  css?: Stitches.CSS
}

const Badge = (props: Props) => {
  const { children, variant, css } = props

  return (
    <Base variant={variant} css={css}>
      <Text size="12" weight="500" align="center" css={{ color: '$accent-11' }}>
        {children < 100 ? children : '99+'}
      </Text>
    </Base>
  )
}

export { Badge }
export type { Props as BadgeProps }
