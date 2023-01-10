import { Stack, styled } from '@tamagui/core'

export const Circle = styled(Stack, {
  // access your tokens and theme values easily with $ props

  backgroundColor: 'red',
  borderRadius: '100%',
  width: 100,
  height: 100
  // borderRadius: '$4',
  // // media and pseudo styles - this would take 15+ lines of brittle JS in RN

  // $gtSm: {
  //   pressStyle: {
  //     borderRadius: '$6'
  //   }
  // },
  // variants: {
  //   // define variants <Circle pin="top" />

  //   // these will flatten, even when nesting multiple styled() calls

  //   pin: {
  //     top: {
  //       position: 'absolute',

  //       top: 0
  //     }
  //   },
  //   size: {
  //     // functional variants give incredible power and save bundle size

  //     '...size': (size, { tokens }) => {
  //       return {
  //         width: tokens.size[size] ?? size,

  //         height: tokens.size[size] ?? size
  //       }
  //     }
  //   }
  // } as const
})
