import React from 'react'

import { Text } from '../text'

import type { TextProps } from '../text'

interface Props extends TextProps {
  children: string
}

const EthAddress = (props: Props) => {
  const { children, ...textProps } = props

  return (
    <Text {...textProps}>
      {children.substring(0, 5)}...{children.substring(children.length - 3)}
    </Text>
  )
}

export { EthAddress }
export type { Props as EthAddressProps }
