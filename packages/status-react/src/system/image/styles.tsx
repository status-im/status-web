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
      full: {
        borderRadius: '100%',
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
