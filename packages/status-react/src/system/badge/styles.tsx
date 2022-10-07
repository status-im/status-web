import { styled } from '../../styles/config'

import type { VariantProps } from '../../styles/config'

export type Variants = VariantProps<typeof Base>

export const Base = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 22,
  height: 22,
  padding: '3px 7px',
  background: '$primary-1',
  /**
   * @see https://copyprogramming.com/howto/css-set-border-radius-relative-to-height
   * @see https://stackoverflow.com/a/66530702/6924883
   */
  borderRadius: 9999,

  variants: {
    variant: {
      border: {
        minWidth: 18,
        height: 18,
        padding: '1px 5px',
        // todo?: use border
        outline: '2px solid $accent-11',
      },
    },
  },
})
