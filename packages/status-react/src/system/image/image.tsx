import React from 'react'

import { Base } from './styles'

import type { Variants } from './styles'

interface Props {
  src: string
  alt: string
  width?: number | '100%'
  height?: number | '100%'
  fit?: Variants['fit']
  radius?: Variants['radius']
}

const Image = (props: Props) => {
  const { width, height, alt, radius, fit } = props

  if (!alt) {
    console.warn(
      'The `alt` prop was not provided to an image. ' +
        'Add `alt` text for screen readers, or set `alt=""` prop to indicate that the image ' +
        'is decorative or redundant with displayed text and should not be announced by screen readers.'
    )
  }

  return (
    <Base
      {...props}
      width={width}
      height={height}
      css={{ width, height }}
      radius={radius}
      fit={fit}
    />
  )
}

export { Image }
export type { Props as ImageProps }
