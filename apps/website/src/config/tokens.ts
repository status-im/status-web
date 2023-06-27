import eth from '@images/tokens/eth.png'
import pepe from '@images/tokens/pepe.png'
import snt from '@images/tokens/snt.png'

export type Token = keyof typeof tokens

export const tokens = {
  eth: {
    src: eth,
    alt: 'ETH token',
    width: 102,
    height: 108,
  },
  pepe: {
    src: pepe,
    alt: 'Pepe the frog token',
    width: 82,
    height: 90,
  },
  snt: {
    src: snt,
    alt: 'SNT token',
    width: 96,
    height: 88,
  },
} as const
