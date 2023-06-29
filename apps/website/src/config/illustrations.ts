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
    width: 48,
    height: 48,
  },
  doge: {
    src: doge,
    alt: 'Doge',
    width: 48,
    height: 48,
  },
  duck: {
    src: duck,
    alt: 'Duck',
    width: 48,
    height: 48,
  },
  flower: {
    src: flower,
    alt: 'Flower',
    width: 48,
    height: 48,
  },
  hand: {
    src: hand,
    alt: 'Hand',
    width: 48,
    height: 48,
  },
  lock: {
    src: lock,
    alt: 'Lock',
    width: 48,
    height: 48,
  },
  megaphone: {
    src: megaphone,
    alt: 'Megaphone',
    width: 48,
    height: 48,
  },
  nft: {
    src: nft,
    alt: 'NFT',
    width: 48,
    height: 48,
  },
  pizza: {
    src: pizza,
    alt: 'Pizza',
    width: 48,
    height: 48,
  },
  rubik: {
    src: rubik,
    alt: 'Rubik',
    width: 48,
    height: 48,
  },
  skull: {
    src: skull,
    alt: 'Skull',
    width: 48,
    height: 48,
  },
  triangle: {
    src: triangle,
    alt: 'Triangle',
    width: 48,
    height: 48,
  },
  ufo: {
    src: ufo,
    alt: 'UFO',
    width: 48,
    height: 48,
  },
  mushroom: {
    src: mushroom,
    alt: 'Mushroom',
    width: 48,
    height: 48,
  },
} as const
