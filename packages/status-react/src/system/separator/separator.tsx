import { Root } from '@radix-ui/react-separator'

import { styled } from '../../styles/config'

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
          minWidth: '100%',
        },

        '&[data-orientation="vertical"]': {
          width: '1px',
          minHeight: '100%',
        },
      },
    },
  },

  defaultVariants: {
    size: '1',
  },
})
