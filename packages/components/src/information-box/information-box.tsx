import { cloneElement } from 'react'

import { CloseIcon } from '@status-im/icons/12'
import { Stack, styled } from '@tamagui/core'

import { Button } from '../button'
import { Text } from '../text'

import type { GetVariants, MapColorToken } from '../types'

type Variants = GetVariants<typeof Base>

type Props = {
  message: string
  variant?: Variants['variant']
  icon?: React.ReactElement
  buttonText?: string
  onButtonPress?: () => void
  onClosePress?: () => void
}

type Variant = Props['variant']

const textColors: MapColorToken<Variant> = {
  default: '$neutral-100',
  information: '$neutral-100',
  error: '$danger-50',
}

const iconColors: MapColorToken<Variant> = {
  default: '$neutral-50',
  information: '$neutral-50',
  error: '$danger-50',
}

const buttonVariants: Record<NonNullable<Variant>, 'primary' | 'danger'> = {
  default: 'primary',
  information: 'primary',
  error: 'danger',
}

const InformationBox = (props: Props) => {
  const {
    message,
    variant = 'default',
    icon,
    buttonText,
    onButtonPress,
    onClosePress,
  } = props

  const textColor = textColors[variant]
  const iconColor = iconColors[variant]
  const buttonVariant = buttonVariants[variant]

  return (
    <Base variant={variant} {...props}>
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
      >
        {icon ? (
          <Stack pr={8} pt={1} alignSelf="flex-start">
            {cloneElement(icon, { color: iconColor })}
          </Stack>
        ) : null}
        <Stack flexShrink={1} width="100%">
          <Text size={13} color={textColor}>
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
        {onClosePress ? (
          <Stack
            pl={8}
            pt={4}
            onPress={() => onClosePress()}
            cursor="pointer"
            alignSelf="flex-start"
          >
            <CloseIcon />
          </Stack>
        ) : null}
      </Stack>
    </Base>
  )
}

export { InformationBox }
export type { Props as InformationBoxProps }

const Base = styled(Stack, {
  name: 'InformationBox',

  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',

  userSelect: 'none',
  borderWidth: 1,

  py: 11,
  px: 16,
  borderRadius: '$12',

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
