import doge from '@images/stickers/doge.png'
import grumpyCat from '@images/stickers/grumpy-cat.png'
import pizza from '@images/stickers/pizza.png'
import punk from '@images/stickers/punk.png'
import smudgeCat from '@images/stickers/smudge-cat.png'

export type Sticker = keyof typeof stickers

export const stickers = {
  doge: {
    src: doge,
    alt: 'doge',
    width: 114,
    height: 114,
  },
  grumpyCat: {
    src: grumpyCat,
    alt: 'grumpyCat',
    width: 114,
    height: 114,
  },
  pizza: {
    src: pizza,
    alt: 'pizza',
    width: 114,
    height: 114,
  },
  punk: {
    src: punk,
    alt: 'punk',
    width: 114,
    height: 114,
  },
  smudgeCat: {
    src: smudgeCat,
    alt: 'smudgeCat',
    width: 114,
    height: 114,
  },
} as const
