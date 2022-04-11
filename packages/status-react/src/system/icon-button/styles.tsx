import { styled } from '~/src/styles/config'

import type { VariantProps } from '~/src/styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('button', {
  width: 32,
  height: 32,
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,

  '&:hover': {
    background: '#EEF2F5',
  },

  '&[aria-expanded="true"]': {
    background: '#F6F8FA',
  },

  variants: {
    color: {
      default: {
        color: '#000',
      },
      gray: {
        color: '#939BA1',
      },
    },
    intent: {
      info: {
        '&:hover': {
          background: 'rgba(67, 96, 223, 0.1)',
          color: '#4360DF',
        },
      },
      danger: {
        '&:hover': {
          background: 'rgba(255, 45, 85, 0.2)',
          color: '#FF2D55',
        },
      },
    },
    active: {
      true: {
        background: '#F6F8FA',
      },
    },
  },

  defaultVariants: {
    color: 'default',
  },
})
