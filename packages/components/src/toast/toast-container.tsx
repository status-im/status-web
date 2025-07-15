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

type Options = ToastRootProps &
  Pick<ToastProps, 'action' | 'onAction'> & {
    autoClose?: boolean
  }

type ToastItem = ToastProps &
  ToastRootProps & {
    id: string
  }

type ToastState = {
  toasts: ToastItem[]
  dismiss: (id: string) => void
  positive: (message: string, options?: Options) => void
  negative: (message: string, options?: Options) => void
  custom: (message: string, icon: IconElement, options?: Options) => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

const useStore = create<ToastState>()(set => ({
  toasts: [],
  positive: (message, options) =>
    set(state => ({
      toasts: [
        ...state.toasts,
        {
          id: generateId(),
          message,
          ...options,
          type: 'positive',
        },
      ],
    })),
  negative: (message, options) =>
    set(state => ({
      toasts: [
        ...state.toasts,
        {
          id: generateId(),
          message,
          ...options,
          type: 'negative',
          duration: options?.autoClose ? options.duration : Infinity,
        },
      ],
    })),
  custom: (message, icon, options) =>
    set(state => ({
      toasts: [
        ...state.toasts,
        {
          id: generateId(),
          message,
          icon,
          ...options,
        },
      ],
    })),
  dismiss: (id: string) =>
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    })),
}))

const ToastContainer = () => {
  const store = useStore()

  if (store.toasts.length === 0) {
    return null
  }

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <Provider swipeDirection="right">
      {store.toasts.map(toast => {
        const handleOpenChange = (open: boolean) => {
          if (!open) {
            store.dismiss(toast.id)
          }
        }

        const { duration, originType, id, ...restProps } = toast

        return (
          <Root
            key={id}
            defaultOpen
            onOpenChange={handleOpenChange}
            className="grid grid-cols-[auto_max-content] grid-rows-[auto_auto] items-center gap-x-4 data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-toast-hide data-[state=open]:animate-toast-slide-in data-[swipe=end]:animate-toast-swipe-out data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-200"
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
        )
      })}
      <Viewport className="fixed bottom-0 right-0 z-[2147483647] flex w-[390px] max-w-[100vw] flex-col gap-2 p-6 [--viewport-padding:24px]" />
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
    [store],
  )
}

export { ToastContainer, useToast }
