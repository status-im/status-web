import { styled } from '../../styles/config'

import type { VariantProps } from '../../styles/config'

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
    background: '$gray-3',
  },

  '&[aria-expanded="true"]': {
    background: '$gray-4',
  },

  variants: {
    color: {
      default: {
        color: '$accent-1',
      },
      gray: {
        color: '$gray-1',
      },
    },
    intent: {
      info: {
        '&:hover': {
          background: '$primary-3',
          color: '$primary-1',
        },
      },
      danger: {
        '&:hover': {
          background: '$danger-2',
          color: '$danger-1',
        },
      },
    },
    active: {
      true: {
        background: '$gray-4',
      },
    },
  },

  defaultVariants: {
    color: 'default',
  },
})
