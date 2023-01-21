import { Stack, styled } from '@tamagui/core'

import { Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'
// import { Pressable } from 'react-native'

const Base = styled(Stack, {
  name: 'Button',
  accessibilityRole: 'button',

  cursor: 'pointer',
  borderRadius: 12,
  display: 'flex',
  paddingHorizontal: 16,
  paddingTop: 7,
  paddingBottom: 9,
  animation: 'fast',
  userSelect: 'none',

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

type BaseProps = GetProps<typeof Base>

type Props = {
  type?: BaseProps['type']
  children: string
  onPress?: () => void
} & Omit<BaseProps, 'type'>

const Button = (props: Props) => {
  const { type = 'primary', children, onPress, ...rest } = props

  return (
    <Base {...rest} type={type} onPress={onPress}>
      <Paragraph color="$white-100" textAlign="center" weight="medium">
        {children}
      </Paragraph>
    </Base>
  )
}

export { Button }
export type { Props as ButtonProps }
