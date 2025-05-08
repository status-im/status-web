import { memo } from 'react'

import renderEmoji from 'react-easy-emoji'

type Props = {
  char: string
  name?: string
}

const nativeEmojis = ['👁️‍🗨️']

export const EmojiTwitter = memo((props: Props) => {
  const { char } = props

  return nativeEmojis.some(emoji => emoji === char)
    ? char
    : renderEmoji(char, {
        protocol: 'http',
        ext: '.png',
      })
})

export type { Props as Emoji }

EmojiTwitter.displayName = 'EmojiTwitter'
