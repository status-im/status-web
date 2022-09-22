import { styled } from '../../styles/config'

import type { VariantProps } from '../../styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('div', {
  position: 'relative',
  borderRadius: '100%',
  flexShrink: 0,

  variants: {
    size: {
      16: {
        width: 16,
        height: 16,
        padding: 1,
      },
      20: {
        width: 20,
        height: 20,
        padding: 1,
      },
      24: {
        width: 24,
        height: 24,
        padding: 1,
      },
      32: {
        width: 32,
        height: 32,
        padding: 2,
      },
      36: {
        width: 36,
        height: 36,
        padding: 2,
      },
      40: {
        width: 40,
        height: 40,
        padding: 2,
      },
      44: {
        width: 44,
        height: 44,
        padding: 2,
      },
      64: {
        width: 64,
        height: 64,
        padding: 3,
      },
      80: {
        width: 80,
        height: 80,
        padding: 4,
      },
      120: {
        width: 120,
        height: 120,
        padding: 5,
      },
    },
  },
})

export const Content = styled('div', {
  background: '$primary-1',
  borderRadius: '100%',
  width: '100%',
  height: '100%',
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
      40: {},
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
      16: { fontSize: 'calc(16 * 0.5px)', lineHeight: '16px' },
      20: { fontSize: 'calc(20 * 0.5px)', lineHeight: '20px' },
      24: { fontSize: 'calc(24 * 0.5px)', lineHeight: '24px' },
      32: { fontSize: 'calc(32 * 0.5px)', lineHeight: '32px' },
      36: { fontSize: 'calc(36 * 0.5px)', lineHeight: '36px' },
      40: { fontSize: 'calc(40 * 0.5px)', lineHeight: '40px' },
      44: { fontSize: 'calc(44 * 0.5px)', lineHeight: '44px' },
      64: { fontSize: 'calc(64 * 0.5px)', lineHeight: '64px' },
      80: { fontSize: 'calc(80 * 0.5px)', lineHeight: '80px' },
      120: { fontSize: 'calc(120 * 0.5px)', lineHeight: '120px' },
    },
  },
})
