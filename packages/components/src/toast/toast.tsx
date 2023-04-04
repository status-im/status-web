import { cloneElement, forwardRef, useMemo } from 'react'

import {
  Action,
  Description,
  Provider,
  Root,
  Viewport,
} from '@radix-ui/react-toast'
import { CorrectIcon, IncorrectIcon } from '@status-im/icons/20'
import { Stack, styled } from '@tamagui/core'
import { create } from 'zustand'

import { Button } from '../button'
import { Text } from '../text'

type ToastState = {
  toast: Props | null
  dismiss: () => void
  positive: (
    message: string,
    actionProps?: Pick<Props, 'action' | 'onAction'>
  ) => void
  negative: (
    message: string,
    actionProps?: Pick<Props, 'action' | 'onAction'>
  ) => void
}

const useStore = create<ToastState>()(set => ({
  toast: null,
  positive: (message, actionProps) =>
    set({ toast: { ...actionProps, message, type: 'positive' } }),
  negative: (message, actionProps) =>
    set({ toast: { ...actionProps, message, type: 'negative' } }),
  dismiss: () => set({ toast: null }),
}))

export const ToastContainer = () => {
  const store = useStore()

  if (store.toast === null) {
    return null
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      store.dismiss()
    }
  }

  return (
    <Provider>
      <ToastRoot
        id="toast-root"
        defaultOpen
        onOpenChange={handleOpenChange}
        style={{ position: 'fixed' }}
      >
        <Toast {...store.toast} />
      </ToastRoot>
      <Viewport />
    </Provider>
  )
}

const ToastRoot = styled(Root, {
  name: 'ToastRoot',
  acceptsClassName: true,

  bottom: 12,
  right: 12,
  zIndex: 1000,
})

export const useToast = () => {
  const store = useStore()

  return useMemo(
    () => ({
      positive: store.positive,
      negative: store.negative,
    }),
    [store]
  )
}

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
      return <CorrectIcon />
    }

    return <IncorrectIcon />
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

const Base = styled(Stack, {
  name: 'Toast',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
  gap: 12,
  width: 351,
  minHeight: 40,
  backgroundColor: '$neutral-80-opa-70',
  borderRadius: 12,
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
