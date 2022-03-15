import { styled } from '~/src/styles/config'

import type { VariantProps } from '~/src/styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('div', {
  position: 'relative',
  background: '#F6F8FA',
  borderRadius: '100%',
  flexShrink: 0,

  variants: {
    size: {
      20: {
        width: 20,
        height: 20,
      },
      24: {
        width: 24,
        height: 24,
      },
      32: {
        width: 32,
        height: 32,
      },
      36: {
        width: 36,
        height: 36,
      },
      44: {
        width: 44,
        height: 44,
      },
      120: {
        width: 120,
        height: 120,
      },
    },
  },
})

export const Indicator = styled('span', {
  position: 'absolute',
  right: -2,
  bottom: -2,
  borderRadius: '100%',
  border: '2px solid #fff',

  variants: {
    size: {
      20: {},
      24: {},
      32: {
        width: 12,
        height: 12,
      },
      36: {},
      44: {},
      120: {},
    },
    state: {
      online: {
        backgroundColor: '#4EBC60',
      },
      offline: {
        backgroundColor: '#939BA1',
      },
    },
  },
})
