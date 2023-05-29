import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'

import type { ColorTokens } from '@tamagui/core'

export type CounterVariants = 'default' | 'grey' | 'secondary' | 'outline'

type Props = {
  value: number
  type?: CounterVariants
}

const Counter = (props: Props) => {
  const { value, type = 'default' } = props

  return (
    <Base>
      <Content type={type}>
        <Text size={11} weight="medium" color={textColors[type]}>
          {value > 99 ? '99+' : value}
        </Text>
      </Content>
    </Base>
  )
}

export { Counter }
export type { Props as CounterProps }

const Base = styled(Stack, {
  padding: 2,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexBasis: 'fit-content',
})

const Content = styled(Stack, {
  backgroundColor: '$primary-50',
  paddingHorizontal: 3,
  paddingVertical: 0,
  borderRadius: '$6',
  minHeight: 16,
  maxHeight: 16,
  minWidth: 16,
  maxWidth: 28,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'transparent',

  variants: {
    type: {
      default: {
        backgroundColor: '$primary-50',
      },
      secondary: {
        backgroundColor: '$neutral-80-opa-5',
      },
      grey: {
        backgroundColor: '$neutral-10',
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$neutral-20',
      },
    },
  },
})

const textColors: Record<NonNullable<Props['type']>, ColorTokens> = {
  default: '$white-100',
  secondary: '$neutral-100',
  outline: '$neutral-100',
  grey: '$neutral-100',
}
