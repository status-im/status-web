import React, { cloneElement, createContext, useContext, useState } from 'react'

const DialogContext = createContext<
  ((dialog: React.ReactElement) => void) | null
>(null)

interface Props {
  children: React.ReactNode
}

export const DialogProvider = (props: Props) => {
  const { children } = props

  const [dialog, setDialog] = useState<React.ReactElement | null>(null)

  return (
    <DialogContext.Provider value={setDialog}>
      {children}
      {dialog &&
        cloneElement(dialog, {
          defaultOpen: true,
          onOpenChange: () => setDialog(null),
        })}
    </DialogContext.Provider>
  )
}

export const useDialogContext = () => {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider')
  }

  return context
}
