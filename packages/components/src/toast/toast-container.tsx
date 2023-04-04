import { useMemo } from 'react'

import { Provider, Root, Viewport } from '@radix-ui/react-toast'
import { styled } from 'tamagui'
import { create } from 'zustand'

import { Toast } from './toast'

import type { ToastProps } from './toast'

type ToastState = {
  toast: ToastProps | null
  dismiss: () => void
  positive: (
    message: string,
    actionProps?: Pick<ToastProps, 'action' | 'onAction'>
  ) => void
  negative: (
    message: string,
    actionProps?: Pick<ToastProps, 'action' | 'onAction'>
  ) => void
  custom: (
    message: string,
    icon: React.ReactElement,
    actionProps?: Pick<ToastProps, 'action' | 'onAction'>
  ) => void
}

const useStore = create<ToastState>()(set => ({
  toast: null,
  positive: (message, actionProps) =>
    set({ toast: { ...actionProps, message, type: 'positive' } }),
  negative: (message, actionProps) =>
    set({ toast: { ...actionProps, message, type: 'negative' } }),
  custom: (message, icon, actionProps) =>
    set({ toast: { ...actionProps, message, icon } }),
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

  return (
    <Provider>
      <ToastRoot
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

const useToast = () => {
  const store = useStore()

  return useMemo(
    () => ({
      positive: store.positive,
      negative: store.negative,
      custom: store.custom,
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
