import { styled } from '~/src/styles/config'

import type { VariantProps } from '~/src/styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('div', {
  position: 'relative',
  background: '$primary-1',
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
      64: {
        width: 64,
        height: 64,
      },
      80: {
        width: 80,
        height: 80,
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
  border: '2px solid $gray-4',

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
      64: {},
      80: {},
      120: {},
    },
    state: {
      online: {
        backgroundColor: '$success-1',
      },
      offline: {
        backgroundColor: '$gray-1',
      },
    },
  },
})

export const Initials = styled('div', {
  width: '100%',
  height: '100%',
  color: '$accent-11',
  textAlign: 'center',
  fontWeight: '$600',
  fontSize: 15,
  textTransform: 'uppercase',
  verticalAlign: 'baseline',
  variants: {
    size: {
      20: { fontSize: 'calc(20 * 0.5px)', lineHeight: '20px' },
      24: { fontSize: 'calc(24 * 0.5px)', lineHeight: '24px' },
      32: { fontSize: 'calc(32 * 0.5px)', lineHeight: '32px' },
      36: { fontSize: 'calc(36 * 0.5px)', lineHeight: '36px' },
      44: { fontSize: 'calc(44 * 0.5px)', lineHeight: '44px' },
      64: { fontSize: 'calc(64 * 0.5px)', lineHeight: '64px' },
      80: { fontSize: 'calc(80 * 0.5px)', lineHeight: '80px' },
      120: { fontSize: 'calc(120 * 0.5px)', lineHeight: '120px' },
    },
  },
})
