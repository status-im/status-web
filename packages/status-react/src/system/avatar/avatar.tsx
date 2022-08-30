import React, { useMemo } from 'react'

import { Image } from '../image'
import { Base, Content, Indicator, Initials } from './styles'
import { generateIdenticonRing } from './utils'

import type { Variants } from './styles'

interface Props {
  size: Variants['size']
  name?: string
  indicator?: 'online' | 'offline'
  src?: string
  color?: string
  colorHash?: number[][]
  initialsCount?: number
}

const Avatar = (props: Props) => {
  const {
    size,
    name,
    src,
    color,
    indicator,
    colorHash,
    initialsCount = 2,
  } = props

  const identiconRing = useMemo(() => {
    if (colorHash) {
      const gradient = generateIdenticonRing(colorHash)
      return `conic-gradient(from 90deg, ${gradient})`
    }
  }, [colorHash])

  const initials = name ? name.slice(0, initialsCount) : ''

  return (
    <Base
      size={size}
      style={{
        background: identiconRing,
        padding: !identiconRing ? 0 : undefined,
      }}
    >
      <Content style={{ background: color }}>
        {initials && <Initials size={size}>{initials}</Initials>}
        {src && (
          <Image
            src={src}
            alt="avatar"
            width="100%"
            height="100%"
            fit="cover"
            radius="full"
          />
        )}
        {indicator && <Indicator size={size} state={indicator} />}
      </Content>
    </Base>
  )
}

export { Avatar }
export type { Props as AvatarProps }
