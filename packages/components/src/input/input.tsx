import { setupReactNative, styled } from '@tamagui/core'
import { focusableInputHOC } from '@tamagui/focusable'
import { TextInput } from 'react-native'

import type { GetProps } from '@tamagui/core'

setupReactNative({
  TextInput,
})

export const InputFrame = styled(
  TextInput,
  {
    name: 'Input',
    fontFamily: '$body',
    borderWidth: 1,
    outlineWidth: 0,
    color: '$textPrimary',
    focusable: true,
    borderColor: '$turquoiseHover',
    backgroundColor: 'transparent',
    placeholderTextColor: 'red',

    // this fixes a flex bug where it overflows container
    minWidth: 0,

    hoverStyle: {
      borderColor: '$beigeHover',
    },

    focusStyle: {
      borderColor: '$blueHover',

      marginHorizontal: -1,
    },

    variants: {
      blurred: {
        true: {
          backgroundColor: '$neutral-80-opa-10',
          borderColor: 'transparent',
          placeholderTextColor: '$turquoiseHover',
        },
      },
    },

    defaultVariants: {
      blurred: '$false',
    },
  },
  {
    isInput: true,
  }
)

export type InputProps = GetProps<typeof InputFrame>

export const Input = focusableInputHOC(InputFrame)
