import { Stack, styled, Text } from '@tamagui/core'

import type { GetProps } from '@tamagui/core'
// import { Button} from 'react-native'

// import { Button as RNButton } from 'react-native'

// setupReactNative({ Button: RNButton })

// import type { GetProps} from '@tamagui/core';

const Base = styled(Stack, {
  // tag: 'button',

  cursor: 'pointer',
  borderRadius: 12,
  display: 'inline-flex',
  paddingHorizontal: 16,
  paddingVertical: 10,

  variants: {
    type: {
      primary: {
        backgroundColor: 'hsla(229, 71%, 57%, 1)',
        hoverStyle: { backgroundColor: 'hsla(229, 54%, 45%, 1)' },
        pressStyle: { backgroundColor: 'hsla(229, 54%, 45%, 1)' },
      },
      positive: {
        backgroundColor: 'hsla(174, 63%, 40%, 1)',
        hoverStyle: { backgroundColor: 'hsla(174, 63%, 34%, 1)' },
        pressStyle: { backgroundColor: 'hsla(174, 63%, 34%, 1)' },
      },
    },
  } as const,
})

const ButtonText = styled(Text, {
  color: 'rgb(255, 255, 255)',
  textAlign: 'center',
})

type BaseProps = GetProps<typeof Base>

interface Props {
  type?: BaseProps['type']
  children: string
}

const Button = (props: Props) => {
  const { type = 'primary', children } = props

  return (
    <Base type={type}>
      <ButtonText>{children}</ButtonText>
    </Base>
  )
}

export { Button }
// const Button =
