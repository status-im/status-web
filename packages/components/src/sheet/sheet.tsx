import { Content, Overlay, Portal, Root, Trigger } from '@radix-ui/react-dialog'

import type React from 'react'

interface Props {
  children: [React.ReactElement, React.ReactElement]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  press?: 'normal' | 'long'
}

const Sheet = (props: Props) => {
  const { children, open, onOpenChange } = props

  const [trigger, content] = children

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      {/* TRIGGER */}
      <Trigger asChild>{trigger}</Trigger>

      {/* CONTENT */}
      <Portal>
        <Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
        {content}
      </Portal>
    </Root>
  )
}

interface DialogContentProps {
  children: React.ReactNode
  initialFocusRef?: React.RefObject<HTMLElement>
}

const SheetContent = (props: DialogContentProps) => {
  const { children, initialFocusRef } = props

  const handleOpenAutoFocus = (event: Event) => {
    if (initialFocusRef?.current) {
      event.preventDefault()
      initialFocusRef.current.focus()
    }
  }

  return (
    <Content
      onOpenAutoFocus={handleOpenAutoFocus}
      style={{
        backgroundColor: 'white',
        padding: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80%',
        // top: 'auto',
        // from
        // transform: 'translate3d(0,100%,0)',
        // to
        transform: 'translate3d(0,0,0)',
      }}
    >
      {children}
    </Content>
  )
}

Sheet.Content = SheetContent

export { Sheet }
