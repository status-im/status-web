import { styled, theme } from '../../styles/config'

import type React from 'react'

// todo?: rich variant here (e.g. mentions, format, code)
const Text = styled('div', {
  fontFamily: theme.fonts.sans,
  overflowWrap: 'break-word',
  lineHeight: 1.5,

  variants: {
    size: {
      '10': {
        fontSize: '10px',
      },
      '12': {
        fontSize: '12px',
      },
      '13': {
        fontSize: '13px',
      },
      '14': {
        fontSize: '14px',
      },
      '15': {
        fontSize: '15px',
      },
    },
    color: {
      accent: {
        color: '$accent-1',
      },
      primary: {
        color: '$primary-1',
      },
      gray: {
        color: '$gray-1',
      },
      current: {
        color: '$current',
      },
    },
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
        // minWidth: 0,
        // maxWidth: '100%',
        flex: 1,
      },
    },
  },

  defaultVariants: {
    align: 'left',
    weight: '400',
    color: 'accent',
  },

  // compoundVariants: {},
})

export { Text }
export type TextProps = React.ComponentProps<typeof Text>
