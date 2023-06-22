import cog from '@images/illustrations/cog.png'
import doge from '@images/illustrations/doge.png'
import duck from '@images/illustrations/duck.png'
import flower from '@images/illustrations/flower.png'
import hand from '@images/illustrations/hand.png'
import lock from '@images/illustrations/lock.png'
import megaphone from '@images/illustrations/megaphone.png'
import mushroom from '@images/illustrations/mushroom.png'
import nft from '@images/illustrations/nft-frame.png'
import pizza from '@images/illustrations/pizza.png'
import rubik from '@images/illustrations/rubik-cube.png'
import skull from '@images/illustrations/skull.png'
import triangle from '@images/illustrations/triangle.png'
import ufo from '@images/illustrations/ufo.png'

export type Illustration = keyof typeof illustrations

export const illustrations = {
  cog: {
    src: cog,
    alt: 'Cog',
  },
  doge: {
    src: doge,
    alt: 'Doge',
  },
  duck: {
    src: duck,
    alt: 'Duck',
  },
  flower: {
    src: flower,
    alt: 'Flower',
  },
  hand: {
    src: hand,
    alt: 'Hand',
  },
  lock: {
    src: lock,
    alt: 'Lock',
  },
  megaphone: {
    src: megaphone,
    alt: 'Megaphone',
  },
  nft: {
    src: nft,
    alt: 'NFT',
  },
  pizza: {
    src: pizza,
    alt: 'Pizza',
  },
  rubik: {
    src: rubik,
    alt: 'Rubik',
  },
  skull: {
    src: skull,
    alt: 'Skull',
  },
  triangle: {
    src: triangle,
    alt: 'Triangle',
  },
  ufo: {
    src: ufo,
    alt: 'UFO',
  },
  mushroom: {
    src: mushroom,
    alt: 'Mushroom',
  },
} as const
