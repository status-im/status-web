// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/namespace */
import { setupReactNative, styled } from '@tamagui/core'
// import { focusableInputHOC } from '@tamagui/focusable'
import { TextInput } from 'react-native'

import type { GetProps } from '@tamagui/core'

// import { inputSizeVariant } from '../helpers/inputHelpers'

setupReactNative({
  TextInput,
})

export const InputFrame = styled(
  TextInput,
  {
    tag: 'input',
    name: 'Input',
    // fontFamily: '$body',
    borderWidth: 1,
    outlineWidth: 0,
    borderColor: 'rgba(0, 200, 0, 1)',

    paddingHorizontal: 30,
    color: 'hsla(218, 51%, 7%, 1)',
    placeholderTextColor: 'hsla(219, 17%, 69%, 1)',
    // color: 'red',
    // color: '$color',
    // focusable: true,
    // borderColor: '$borderColor',
    // backgroundColor: '$background',
    // placeholderTextColor: '$placeholderColor',

    backgroundColor: 'rgb(255, 255, 255)',

    height: 40,
    borderRadius: 12,

    // this fixes a flex bug where it overflows container
    minWidth: 0,

    // hoverStyle: {
    // borderColor: '$borderColorHover',
    // },/

    // focusStyle: {

    //   borderWidth: 2,
    //   marginHorizontal: -1,
    // },

    // variants: {
    //   size: {
    //     // '...size': inputSizeVariant,
    //   },
    // } as const,

    // defaultVariants: {
    //   size: '$true',
    // },
  }
  // {
  //   isInput: true,
  // }
)

export type InputProps = GetProps<typeof InputFrame>

// export const Input = focusableInputHOC(InputFrame)
export const Input = InputFrame
