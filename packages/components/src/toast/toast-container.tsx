import { useMemo } from 'react'

import { Provider, Root, Viewport } from '@radix-ui/react-toast'
import { styled } from 'tamagui'
import { create } from 'zustand'

import { Toast } from './toast'

import type { ToastProps } from './toast'
import type { ToastProps as RootProps } from '@radix-ui/react-toast'

type ToastRootProps = Partial<Pick<RootProps, 'duration' | 'type'>>

type ToastState = {
  toast: (ToastProps & { rootProps?: ToastRootProps }) | null
  dismiss: () => void
  positive: (args: {
    message: string
    actionProps?: Pick<ToastProps, 'action' | 'onAction'>
    rootProps?: ToastRootProps
  }) => void
  negative: (args: {
    message: string
    actionProps?: Pick<ToastProps, 'action' | 'onAction'>
    rootProps?: ToastRootProps
  }) => void
  custom: (args: {
    message: string
    icon: React.ReactElement
    actionProps?: Pick<ToastProps, 'action' | 'onAction'>
    rootProps?: ToastRootProps
  }) => void
}

const useStore = create<ToastState>()(set => ({
  toast: null,
  positive: args =>
    set({
      toast: {
        ...args,
        type: 'positive',
      },
    }),
  negative: args =>
    set({
      toast: {
        ...args,
        type: 'negative',
      },
    }),
  custom: args =>
    set({
      toast: { ...args },
    }),
  dismiss: () => set({ toast: null }),
}))

const ToastContainer = () => {
  const store = useStore()

  if (store.toast === null) {
    return null
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      store.dismiss()
    }
  }

  const { rootProps, ...restProps } = store.toast

  return (
    <Provider>
      <ToastRoot
        defaultOpen
        onOpenChange={handleOpenChange}
        style={{ position: 'fixed' }}
        // note: prevent swipe gestures from closing the toast until animation is implemented
        onSwipeStart={event => event.preventDefault()}
        onSwipeMove={event => event.preventDefault()}
        onSwipeCancel={event => event.preventDefault()}
        onSwipeEnd={event => event.preventDefault()}
        {...rootProps}
      >
        <Toast {...restProps} />
      </ToastRoot>
      <Viewport />
    </Provider>
  )
}

const useToast = () => {
  const store = useStore()

  return useMemo(
    () => ({
      positive: store.positive,
      negative: store.negative,
      custom: store.custom,
      dismiss: store.dismiss,
    }),
    [store]
  )
}

export { ToastContainer, useToast }

const ToastRoot = styled(Root, {
  name: 'ToastRoot',
  acceptsClassName: true,

  bottom: 12,
  right: 12,
  zIndex: 1000,
})
