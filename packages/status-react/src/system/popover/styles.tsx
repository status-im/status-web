import { styled } from '~/src/styles/config'

import type { VariantProps } from '~/src/styles/config'

export type Variants = VariantProps<typeof Content>

export const Content = styled('div', {
  backgroundColor: 'white',
  borderRadius: 8,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
})
