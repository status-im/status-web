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
  borderRadius: '$8',
  transitionProperty: 'background-color, border-color, color, fill, stroke',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionDuration: '150ms',

  '&:disabled': {
    color: '$gray-1',
    background: '$gray-2',
    cursor: 'not-allowed',
    '&:hover': {
      background: '$gray-2',
    },
  },

  variants: {
    variant: {
      default: {
        background: '$primary-3',
        color: '$primary-1',
        '&:hover': {
          background: '$primary-2',
        },
      },
      danger: {
        background: '$danger-3',
        color: '$danger-1',
        '&:hover': {
          background: '$danger-2',
        },
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
