import { styled } from '../../styles/config'

import type { VariantProps } from '../../styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('button', {
  fontFamily: '$sans',
  fontWeight: '$500',
  fontSize: '15px',
  lineHeight: 1.4,
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px 24px',
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
      secondary: {
        background: '$transparent',
        color: '$primary-1',
        '&:hover': {
          background: '$primary-3',
        },
        '&[data-state="active"]': {
          background: '$primary-2',
          '&:hover': {
            backgroundColor: '$primary-2', // override default hover behavior
          },
        },
      },
      danger: {
        background: '$danger-3',
        color: '$danger-1',
        '&:hover': {
          background: '$danger-2',
        },
      },
      outline: {
        background: '$transparent',
        color: '$primary-1',
        '&:hover': {
          background: '$primary-3',
        },
      },
    },
    size: {
      small: {
        height: '38px',
        fontSize: '13px',
        padding: '0px 12px',
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
  defaultVariants: {
    variant: 'default',
  },
})
