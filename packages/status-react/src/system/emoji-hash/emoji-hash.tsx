import React from 'react'

import { Base } from './styles'

interface Props {
  name?: string
}

const EmojiHash = () => {
  return (
    <Base>
      π©ππ₯π¦ππ‘
      <br />
      ππ»β£οΈπβΈπ΅π±
    </Base>
  )
}

export { EmojiHash }
export type { Props as EmojiHashProps }
