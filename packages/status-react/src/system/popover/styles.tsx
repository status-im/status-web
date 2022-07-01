import { styled } from '../../styles/config'

import type { VariantProps } from '../../styles/config'

export type Variants = VariantProps<typeof Content>

export const Content = styled('div', {
  backgroundColor: '$accent-11',
  borderRadius: 8,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
})
