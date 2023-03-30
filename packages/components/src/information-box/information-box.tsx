import { cloneElement } from 'react'

import { Stack, styled } from '@tamagui/core'

import { Button } from '../button'
import { Text } from '../text'

import type { GetVariants } from '../types'
import type { ColorTokens, StackProps } from '@tamagui/core'

type Variants = GetVariants<typeof Base>

type InformationBoxProps = {
  message: string
  variant?: Variants['variant']
  icon?: React.ReactElement
  buttonText?: string
  onButtonPress?: () => void
  onDismiss?: () => void
} & StackProps

const colorTextValue: Record<
  NonNullable<InformationBoxProps['variant']>,
  ColorTokens
> = {
  default: '$neutral-100',
  information: '$neutral-100',
  error: '$danger-50',
}

const colorIconValue: Record<
  NonNullable<InformationBoxProps['variant']>,
  ColorTokens
> = {
  default: '$neutral-50',
  information: '$neutral-50',
  error: '$danger-50',
}

const buttonVariantValue: Record<
  NonNullable<InformationBoxProps['variant']>,
  'primary' | 'danger'
> = {
  default: 'primary',
  information: 'primary',
  error: 'danger',
}

const InformationBox = ({
  message,
  variant = 'default',
  icon,
  buttonText,
  onButtonPress,
  onDismiss,
  ...props
}: InformationBoxProps) => {
  const colorText = colorTextValue[variant]
  const colorIcon = colorIconValue[variant]
  const buttonVariant = buttonVariantValue[variant]

  return (
    <Base variant={variant} {...props}>
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
      >
        {icon ? (
          <Stack pr={8} pt={1} alignSelf="flex-start">
            {cloneElement(icon, { color: colorIcon })}
          </Stack>
        ) : null}
        <Stack flexShrink={1}>
          <Text size={13} color={colorText}>
            {message}
          </Text>
          {buttonText ? (
            <Stack pt={8} width="fit-content">
              <Button
                onPress={() => onButtonPress?.()}
                size={24}
                variant={buttonVariant}
              >
                {buttonText}
              </Button>
            </Stack>
          ) : null}
        </Stack>
        {onDismiss ? (
          <Stack pl={8} pt={1} alignSelf="flex-end" onPress={() => onDismiss()}>
            <Text size={13} color={colorText}>
              Dismiss
            </Text>
          </Stack>
        ) : null}
      </Stack>
    </Base>
  )
}

const Base = styled(Stack, {
  name: 'InformationBox',

  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',

  userSelect: 'none',
  borderWidth: 1,

  py: 11,
  px: 16,
  borderRadius: 12,

  variants: {
    variant: {
      default: {
        backgroundColor: '$white-100',
        borderColor: '$neutral-20',
      },
      information: {
        backgroundColor: '$blue-50-opa-5',
        borderColor: '$blue-50-opa-10',
      },
      error: {
        backgroundColor: '$danger-50-opa-5',
        borderColor: '$danger-50-opa-10',
      },
    },
  },
})

export { InformationBox }
