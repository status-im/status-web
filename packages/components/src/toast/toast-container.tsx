import { useMemo } from 'react'

import { Provider, Root, Viewport } from '@radix-ui/react-toast'
import { styled } from 'tamagui'
import { create } from 'zustand'

import { Toast } from './toast'

import type { ToastProps } from './toast'
import type { ToastProps as RootProps } from '@radix-ui/react-toast'

type ToastRootProps = Partial<Pick<RootProps, 'duration'>> & {
  originType?: RootProps['type']
}

type Options = ToastRootProps & Pick<ToastProps, 'action' | 'onAction'>

type ToastState = {
  toast: (ToastProps & ToastRootProps) | null
  dismiss: () => void
  positive: (message: string, options?: Options) => void
  negative: (message: string, options?: Options) => void
  custom: (message: string, icon: React.ReactElement, options?: Options) => void
}

const useStore = create<ToastState>()(set => ({
  toast: null,
  positive: (message, options) =>
    set({
      toast: {
        message,
        ...options,
        type: 'positive',
      },
    }),
  negative: (message, options) =>
    set({
      toast: {
        message,
        ...options,
        type: 'negative',
      },
    }),
  custom: (message, icon, options) =>
    set({
      toast: { message, icon, ...options },
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

  const { duration, originType, ...restProps } = store.toast

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
        {...(duration && { duration })}
        {...(originType && { type: originType })}
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
