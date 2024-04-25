import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'

import type { ColorTokens } from '@tamagui/core'

// todo?: rename netural to default
export type StepVariants = 'neutral' | 'complete' | 'active'

type Props = {
  size: 18 | 22
  value: number
  type?: StepVariants
}

const Step = (props: Props) => {
  const { size, value, type = 'neutral' } = props

  return (
    <Base size={size}>
      <Content size={size} type={type}>
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
  minWidth: 20,
  maxWidth: 28,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexBasis: 'fit-content',
  width: 'fit-content',

  variants: {
    size: {
      18: {
        paddingVertical: 1,
        minWidth: 20,
        maxWidth: 28,
      },
      22: {
        minWidth: 24,
        maxWidth: 32,
      },
    },
  },
})

const Content = styled(Stack, {
  backgroundColor: '$white-100',
  paddingHorizontal: 3,
  paddingVertical: 0,
  borderRadius: '$6',
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
        backgroundColor: '$blue/10',
      },
    },
    size: {
      18: {
        height: 18,
        minWidth: 18,
        maxWidth: 28,
      },
      22: {
        height: 22,
        minWidth: 22,
        maxWidth: 32,
      },
    },
  },
})

const textColors: Record<NonNullable<Props['type']>, ColorTokens> = {
  neutral: '$neutral-100',
  complete: '$white-100',
  active: '$neutral-100',
}
