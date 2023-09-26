import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'

import type { ColorTokens } from '@tamagui/core'

// todo?: rename netural to default
export type StepVariants = 'neutral' | 'complete' | 'active'

type Props = {
  value: number
  type?: StepVariants
}

const Step = (props: Props) => {
  const { value, type = 'neutral' } = props

  return (
    <Base>
      <Content type={type}>
        <Text size={11} weight="medium" color={textColors[type]}>
          {value}
        </Text>
      </Content>
    </Base>
  )
}

export { Step }
export type { Props as StepProps }

const Base = styled(Stack, {
  paddingVertical: 1,
  minWidth: 20,
  maxWidth: 28,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexBasis: 'fit-content',
  width: 'fit-content',
})

const Content = styled(Stack, {
  backgroundColor: '$white-100',
  paddingHorizontal: 3,
  paddingVertical: 0,
  borderRadius: '$6',
  height: 18,
  minWidth: 18,
  maxWidth: 28,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'transparent',

  variants: {
    type: {
      neutral: {
        backgroundColor: '$transparent',
        borderColor: '$neutral-20',
      },
      complete: {
        backgroundColor: '$blue-50',
      },
      active: {
        backgroundColor: '$blue-50-opa-10',
      },
    },
  },
})

const textColors: Record<NonNullable<Props['type']>, ColorTokens> = {
  neutral: '$neutral-100',
  complete: '$white-100',
  active: '$neutral-100',
}
