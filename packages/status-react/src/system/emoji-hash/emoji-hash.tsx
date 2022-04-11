import React from 'react'

import { Base } from './styles'

interface Props {
  name?: string
}

const EmojiHash = (props: Props) => {
  const { name } = props

  console.log(name)

  return (
    <Base>
      🎩🍞🥑🦍🌈📡
      <br />
      💅🏻♣️🔔⛸👵🅱
    </Base>
  )
}

export { EmojiHash }
export type { Props as EmojiHashProps }
