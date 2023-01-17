import { Stack, styled, Text } from '@tamagui/core'

import type { GetProps } from '@tamagui/core'

const Base = styled(Stack, {
  // tag: 'button',

  cursor: 'pointer',
  borderRadius: 12,
  display: 'inline-flex',
  paddingHorizontal: 16,
  paddingVertical: 10,
  animation: 'fast',
  variants: {
    type: {
      primary: {
        backgroundColor: '$primary',
        hoverStyle: { backgroundColor: '$primaryHover' },
        pressStyle: { backgroundColor: '$primaryHover' },
      },
      positive: {
        backgroundColor: '$success',
        hoverStyle: { backgroundColor: '$successHover' },
        pressStyle: { backgroundColor: '$successHover' },
      },
    },
  } as const,
})

const ButtonText = styled(Text, {
  fontFamily: '$inter',
  textAlign: 'center',
  color: '$white-100',
})

type BaseProps = GetProps<typeof Base>

interface Props {
  type?: BaseProps['type']
  children: string
  onPress?: () => void
}

const Button = (props: Props) => {
  const { type = 'primary', children, onPress } = props

  return (
    <Base type={type} onPress={onPress}>
      <ButtonText>{children}</ButtonText>
    </Base>
  )
}

export { Button }
