import { styled } from '~/src/styles/config'

import type { VariantProps } from '~/src/styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('img', {
  display: 'block',
  verticalAlign: 'middle',
  maxWidth: '100%',
  height: 'auto',

  variants: {
    radius: {
      1: {
        borderRadius: '$1',
      },
      2: {
        borderRadius: '$2',
      },
      full: {
        borderRadius: '$full',
      },
      bubble: {
        borderRadius: '16px 16px 4px 16px',
      },
    },
    fit: {
      contain: {
        objectFit: 'contain',
      },
      cover: {
        objectFit: 'cover',
      },
      fill: {
        objectFit: 'fill',
      },
      none: {
        objectFit: 'none',
      },
    },
  },
})
