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
  },
  grumpyCat: {
    src: grumpyCat,
    alt: 'grumpyCat',
  },
  pizza: {
    src: pizza,
    alt: 'pizza',
  },
  punk: {
    src: punk,
    alt: 'punk',
  },
  smudgeCat: {
    src: smudgeCat,
    alt: 'smudgeCat',
  },
} as const
