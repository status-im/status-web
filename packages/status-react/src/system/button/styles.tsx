import { styled } from '~/src/styles/config'

import type { VariantProps } from '~/src/styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('button', {
  all: 'unset',
  fontFamily: '$sans',
  fontWeight: '$500',
  fontSize: '15px',
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '11px 24px',
  borderRadius: 8,
  transitionProperty: 'background-color, border-color, color, fill, stroke',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDuration: '150ms',

  '&:disabled': {
    background: '#EEF2F5',
    color: '#939BA1',
    cursor: 'not-allowed',
  },

  variants: {
    variant: {
      default: {
        background: 'rgba(67, 96, 223, 0.1)',
        color: '#4360DF',
        '&:hover': {},
      },
      minimal: {
        '&:hover': {},
      },
      danger: {
        background: 'rgba(255, 45, 85, 0.1)',
        color: '#FF2D55',
        '&:hover': {},
      },
    },
    loading: {
      true: {},
    },
    width: {
      full: {
        width: '100%',
      },
    },
  },
})
