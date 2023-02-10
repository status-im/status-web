import { Stack, styled } from '@tamagui/core'

export const Divider = styled(Stack, {
  name: 'Divider',
  backgroundColor: '$neutral-80-opa-10',
  flexShrink: 0,
  // borderWidth: 0,
  flex: 1,
  height: '100%',
  // maxHeight: 0,
  maxWidth: 1,
  width: 1,
  marginHorizontal: 12,
  // y: -0.5,

  variants: {
    // vertical: {
    //   true: {
    //     y: 0,
    //     x: -0.5,
    //     height: isWeb ? 'initial' : 'auto',
    //     // maxHeight auto WILL BE passed to style attribute, but for some reason not used?
    //     // almost seems like a react or browser bug, but for now `initial` works
    //     // also, it doesn't happen for `height`, but for consistency using the same values
    //     maxHeight: isWeb ? 'initial' : 'auto',
    //     width: 0,
    //     maxWidth: 0,
    //     borderBottomWidth: 0,
    //     borderRightWidth: 1,
    //   },
    // },
  } as const,
})
