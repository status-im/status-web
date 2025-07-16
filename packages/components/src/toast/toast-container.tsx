/**
 * We control the toast open state manually and override Radix's internal timer
due to this issue: https://github.com/radix-ui/primitives/issues/2233
 *
 * Radix `duration` is set to Infinity and we handle auto-dismiss via a custom
 * timer (`scheduleAutoDismiss`). This ensures:
 * - Proper open/close animations (data-state transitions)
 * - Manual control over when to remove the toast from the state
 * - Ability to persist toasts indefinitely until explicitly dismissed
 */

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

type ToastItem = ToastProps &
  ToastRootProps & {
    id: string
    open: boolean
    timerId?: number
  }

type ToastState = {
  toasts: ToastItem[]
  dismiss: (id: string) => void
  remove: (id: string) => void
  positive: (message: string, options?: Options) => void
  negative: (message: string, options?: Options) => void
  custom: (message: string, icon: IconElement, options?: Options) => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

const scheduleAutoDismiss = (
  id: string,
  duration: number,
  get: () => ToastState,
  set: (fn: (state: ToastState) => ToastState | Partial<ToastState>) => void,
) => {
  if (duration === Infinity) return

  const timerId = window.setTimeout(() => {
    get().dismiss(id)
  }, duration)

  set((state: ToastState) => ({
    toasts: state.toasts.map(toast =>
      toast.id === id ? { ...toast, timerId } : toast,
    ),
  }))
}

const DELAY_TO_DISMISS = 4000
const ANIMATION_DURATION = 150

const useStore = create<ToastState>()((set, get) => ({
  toasts: [],
  positive: (message, options) => {
    const id = generateId()
    const duration = options?.duration ?? DELAY_TO_DISMISS

    set(state => ({
      toasts: [
        ...state.toasts,
        {
          id,
          message,
          ...options,
          type: 'positive',
          duration: Infinity,
          open: true,
        },
      ],
    }))

    scheduleAutoDismiss(id, duration, get, set)
  },
  negative: (message, options) => {
    const id = generateId()

    set(state => ({
      toasts: [
        ...state.toasts,
        {
          id,
          message,
          ...options,
          type: 'negative',
          duration: Infinity,
          open: true,
        },
      ],
    }))
  },
  custom: (message, icon, options) => {
    const id = generateId()
    const duration = options?.duration ?? DELAY_TO_DISMISS

    set(state => ({
      toasts: [
        ...state.toasts,
        {
          id,
          message,
          icon,
          ...options,
          type: 'custom',
          duration: Infinity,
          open: true,
        },
      ],
    }))

    scheduleAutoDismiss(id, duration, get, set)
  },
  dismiss: (id: string) => {
    const toast = get().toasts.find(t => t.id === id)
    if (toast?.timerId) {
      clearTimeout(toast.timerId)
    }

    set(state => ({
      toasts: state.toasts.map(toast =>
        toast.id === id ? { ...toast, open: false } : toast,
      ),
    }))
  },
  remove: (id: string) => {
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }))
  },
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

            setTimeout(() => store.remove(toast.id), ANIMATION_DURATION)
          }
        }

        const { duration, originType, id, open, ...restProps } = toast

        return (
          <Root
            key={id}
            open={open}
            onOpenChange={handleOpenChange}
            className="grid grid-cols-[auto_max-content] grid-rows-[auto_auto] items-center gap-x-4 data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-toast-hide data-[state=open]:animate-toast-slide-in data-[swipe=end]:animate-toast-swipe-out data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-200"
            duration={duration}
            type={originType}
          >
            <Toast {...restProps} />
          </Root>
        )
      })}
      <Viewport className="fixed bottom-0 right-0 z-[99999] flex w-[390px] max-w-[100vw] flex-col gap-2 p-6 [--viewport-padding:24px]" />
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
