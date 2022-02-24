import React, { createContext, useContext, useState } from 'react'

import type { Toast } from '../models/Toast'

const ToastContext = createContext<{
  toasts: Toast[]
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>
}>({
  toasts: [],
  setToasts: () => undefined,
})

export function useToasts() {
  return useContext(ToastContext)
}

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {children}
    </ToastContext.Provider>
  )
}
