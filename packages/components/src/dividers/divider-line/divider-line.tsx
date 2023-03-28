import { Stack, styled } from '@tamagui/core'

export const DividerLine = styled(Stack, {
  name: 'DividerLine',
  backgroundColor: '$neutral-10',
  variants: {
    orientation: {
      horizontal: {
        width: '100%',
        height: '1px',
      },
      vertical: {
        height: '100%',
        width: '1px',
      },
    },
  } as const,

  defaultVariants: {
    orientation: 'horizontal',
  },
})
