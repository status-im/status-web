import { setupReactNative, Stack, styled, Text } from '@tamagui/core'
// import { focusableInputHOC } from '@tamagui/focusable'
import { TextInput } from 'react-native'

import { Avatar } from '../avatar'
import { Button } from '../button'
import { Image } from '../image'

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
    //   // borderColor: '$borderColorFocus',
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

const Name = styled(Text, {})

const Desc = styled(Text, {})

export type InputProps = GetProps<typeof InputFrame>

interface Props {
  name: string
  description: string
  membersCount: number
}

const _Sidebar = (props: Props) => {
  const { name, description, membersCount } = props

  return (
    <Stack backgroundColor="rgb(255,255,255)">
      <Image
        src="https://images.unsplash.com/photo-1584475784921-d9dbfd9d17ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
        width={350}
        height={136}
      />
      <Stack
        paddingHorizontal={16}
        paddingBottom={16}
        marginTop={-16}
        backgroundColor="rgb(255,255,255)"
        borderTopLeftRadius={16}
        borderTopRightRadius={16}
        zIndex={10}
      >
        <Stack marginTop={-32} marginBottom={12}>
          <Avatar
            src="https://images.unsplash.com/photo-1553835973-dec43bfddbeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
            size={56}
          />
        </Stack>
        <Name marginBottom={16}>{name}</Name>
        <Desc marginBottom={12}>{description}</Desc>
        <Desc marginBottom={12}>{membersCount}</Desc>
        <Button>Request to join community</Button>
      </Stack>
    </Stack>
  )
}

// export const Input = focusableInputHOC(InputFrame)
export const Sidebar = _Sidebar
