'use client'

import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { Provider, Root, Viewport } from '@radix-ui/react-toast'
import { create } from 'zustand'

import { Toast } from './toast'

import type { IconElement } from '../types'
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
  custom: (message: string, icon: IconElement, options?: Options) => void
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

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <Provider>
      <Root
        defaultOpen
        onOpenChange={handleOpenChange}
        className="fixed bottom-3 right-3 z-[1000]"
        // note: prevent swipe gestures from closing the toast until animation is implemented
        onSwipeStart={event => event.preventDefault()}
        onSwipeMove={event => event.preventDefault()}
        onSwipeCancel={event => event.preventDefault()}
        onSwipeEnd={event => event.preventDefault()}
        duration={duration}
        type={originType}
      >
        <Toast {...restProps} />
      </Root>
      <Viewport />
    </Provider>,
    document.body,
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
    [store.positive, store.negative, store.custom, store.dismiss],
  )
}

export { ToastContainer, useToast }
