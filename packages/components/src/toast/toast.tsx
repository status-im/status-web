import { cloneElement, forwardRef } from 'react'

import { Action, Description } from '@radix-ui/react-toast'
import { CorrectIcon, IncorrectIcon } from '@status-im/icons'
import { Stack, styled } from '@tamagui/core'

import { Button } from '../button'
import { Text } from '../text'

type Props = {
  message: string
  action?: string
  onAction?: () => void
} & (
  | {
      type: 'positive' | 'negative'
    }
  | {
      type?: never
      icon: React.ReactElement
    }
)

const Toast = (props: Props) => {
  const { message, action, onAction } = props

  const renderIcon = () => {
    if (!props.type) {
      return cloneElement(props.icon, { color: '$white-70' })
    }

    if (props.type === 'positive') {
      return <CorrectIcon size={20} />
    }

    return <IncorrectIcon size={20} />
  }

  return (
    <Base action={Boolean(action)}>
      <Stack flex={1} flexDirection="row" gap={4}>
        <Stack width={20}>{renderIcon()}</Stack>
        <Description asChild>
          <Text size={13} weight={'medium'} color="$white-100">
            {message}
          </Text>
        </Description>
      </Stack>
      {action && (
        <Stack alignSelf="flex-start">
          <Action asChild altText={action}>
            <Button size={24} variant={'grey'} onPress={onAction}>
              {action}
            </Button>
          </Action>
        </Stack>
      )}
    </Base>
  )
}

const _Toast = forwardRef(Toast)

export { _Toast as Toast }
export type { Props as ToastProps }

const Base = styled(Stack, {
  name: 'Toast',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
  gap: 12,
  width: 351,
  minHeight: 40,
  backgroundColor: '$neutral-80/70',
  borderRadius: '$12',
  justifyContent: 'space-between',

  variants: {
    action: {
      true: {
        paddingVertical: 8,
      },
      false: {
        paddingVertical: 10,
      },
    },
  },
})
