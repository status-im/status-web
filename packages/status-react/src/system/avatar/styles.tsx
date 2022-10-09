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
        '--identicon-size': '1px',
        padding: 'var(--identicon-size)',
      },
      20: {
        width: 20,
        height: 20,
        '--identicon-size': '1px',
        padding: 'var(--identicon-size)',
      },
      24: {
        width: 24,
        height: 24,
        '--identicon-size': '1px',
        padding: 'var(--identicon-size)',
      },
      32: {
        width: 32,
        height: 32,
        '--identicon-size': '2px',
        padding: 'var(--identicon-size)',
      },
      36: {
        width: 36,
        height: 36,
        '--identicon-size': '2px',
        padding: 'var(--identicon-size)',
      },
      40: {
        width: 40,
        height: 40,
        '--identicon-size': '2px',
        padding: 'var(--identicon-size)',
      },
      44: {
        width: 44,
        height: 44,
        '--identicon-size': '2px',
        padding: 'var(--identicon-size)',
      },
      64: {
        width: 64,
        height: 64,
        '--identicon-size': '3px',
        padding: 'var(--identicon-size)',
      },
      80: {
        width: 80,
        height: 80,
        '--identicon-size': '4px',
        padding: 'var(--identicon-size)',
      },
      120: {
        width: 120,
        height: 120,
        '--identicon-size': '5px',
        padding: 'var(--identicon-size)',
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
      16: {},
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
  opacity: 0.7,
  textAlign: 'center',
  fontWeight: '$600',
  fontSize: 15,
  textTransform: 'uppercase',
  verticalAlign: 'baseline',
  variants: {
    size: {
      16: {
        fontSize: 'calc(16 * 0.4px)',
        lineHeight: 'calc(16px - var(--identicon-size))',
      },
      20: {
        fontSize: 'calc(20 * 0.4px)',
        lineHeight: 'calc(20px - var(--identicon-size))',
      },
      24: {
        fontSize: 'calc(24 * 0.4px)',
        lineHeight: 'calc(24px - var(--identicon-size))',
      },
      32: {
        fontSize: 'calc(32 * 0.4px)',
        lineHeight: 'calc(32px - var(--identicon-size))',
      },
      36: {
        fontSize: 'calc(36 * 0.4px)',
        lineHeight: 'calc(36px - var(--identicon-size))',
      },
      40: {
        fontSize: 'calc(40 * 0.4px)',
        lineHeight: 'calc(40px - var(--identicon-size))',
      },
      44: {
        fontSize: 'calc(44 * 0.4px)',
        lineHeight: 'calc(44px - var(--identicon-size))',
      },
      64: {
        fontSize: 'calc(64 * 0.4px)',
        lineHeight: 'calc(64px - var(--identicon-size))',
      },
      80: {
        fontSize: 'calc(80 * 0.4px)',
        lineHeight: 'calc(80px - var(--identicon-size))',
      },
      120: {
        fontSize: 'calc(120 * 0.4px)',
        lineHeight: 'calc(120px - var(--identicon-size))',
      },
    },
  },
})
