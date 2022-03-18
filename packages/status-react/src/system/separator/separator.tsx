import { Root } from '@radix-ui/react-separator'

import { styled } from '~/src/styles/config'

export const Separator = styled(Root, {
  border: 'none',
  margin: 0,
  flexShrink: 0,
  backgroundColor: '$accent-7',
  cursor: 'default',

  variants: {
    size: {
      '1': {
        '&[data-orientation="horizontal"]': {
          height: '1px',
          width: '100%',
        },

        '&[data-orientation="vertical"]': {
          width: '1px',
          height: '100%',
        },
      },
    },
  },

  defaultVariants: {
    size: '1',
  },
})
