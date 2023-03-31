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
    tag: 'input',
    name: 'Input',

    borderWidth: 1,
    outlineWidth: 0,
    borderColor: 'rgba(0, 200, 0, 1)',

    paddingHorizontal: 30,
    color: 'hsla(218, 51%, 7%, 1)',
    placeholderTextColor: '$placeHolderColor',

    backgroundColor: 'transparent',

    height: 32,
    borderRadius: '$12',

    animation: 'fast',

    // this fixes a flex bug where it overflows container
    minWidth: 0,

    hoverStyle: {
      borderColor: '$beigeHover',
    },

    focusStyle: {
      borderColor: '$blueHover',
    },

    variants: {
      blurred: {
        true: {
          placeholderTextColor: '$placeHolderColorBlurred',
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
