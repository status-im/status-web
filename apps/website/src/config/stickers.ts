import cube from '@images/stickers/cube.png'
import doge from '@images/stickers/doge.png'
import gamepad from '@images/stickers/gamepad.png'
import grumpyCat from '@images/stickers/grumpy-cat.png'
import megaphone from '@images/stickers/megaphone.png'
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
  gamepad: {
    src: gamepad,
    alt: 'gamepad',
    width: 132,
    height: 132,
  },
  megaphone: {
    src: megaphone,
    alt: 'megaphone',
    width: 120,
    height: 120,
  },
  cube: {
    src: cube,
    alt: 'rubic cube',
    width: 102,
    height: 102,
  },
} as const
