import { styled, theme } from '~/src/styles/config'

import type React from 'react'

const Heading = styled('div', {
  fontFamily: theme.fonts.sans,
  fontSize: '17px',

  variants: {
    size: {},
    color: {},
    weight: {
      '400': {
        fontWeight: theme.fontWeights[400],
      },
      '500': {
        fontWeight: theme.fontWeights[500],
      },
      '600': {
        fontWeight: theme.fontWeights[600],
      },
    },
    align: {
      left: {
        textAlign: 'left',
      },
      right: {
        textAlign: 'right',
      },
      center: {
        textAlign: 'center',
      },
    },
    transform: {
      uppercase: {
        textTransform: 'uppercase',
      },
      lowercase: {
        textTransform: 'lowercase',
      },
      capitalize: {
        textTransform: 'capitalize',
      },
    },
    truncate: {
      true: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        minWidth: 0,
        maxWidth: '100%',
      },
    },
  },

  defaultVariants: {
    align: 'left',
  },

  // compoundVariants: {},
})

export { Heading }
export type HeadingProps = React.ComponentProps<typeof Heading>
