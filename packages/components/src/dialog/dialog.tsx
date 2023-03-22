import { forwardRef } from 'react'

import { Content, Overlay, Portal, Root, Trigger } from '@radix-ui/react-dialog'
import { Stack, styled, useMedia } from 'tamagui'

import { Sheet } from '../sheet'

import type { Ref } from 'react'
import type React from 'react'

interface Props {
  children: [React.ReactElement, React.ReactElement]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  press?: 'normal' | 'long'
}

const Wrapper = styled(Stack, {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100vh',
})

// const DialogTrigger = (
//   props: DialogTriggerProps & {
//     press: Props['press']
//     children: React.ReactElement
//   }
// ) => {
//   const { children, press, onClick, type, ...triggerProps } = props
//   const handler = press === 'normal' ? 'onPress' : 'onLongPress'

//   // console.log('dialog', press, onClick, { ...triggerProps, [handler]: onClick })
//   return cloneElement(children, { ref, ...triggerProps, [handler]: onClick })
// }

// TODO: allow customization of press duration
const Dialog = (props: Props) => {
  const { children, open, onOpenChange /* press = 'normal' */ } = props

  const [trigger, content] = children

  const media = useMedia()

  if (media.sm) {
    return (
      <Sheet>
        {trigger}
        {content}
      </Sheet>
    )
  }

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      {/* TRIGGER */}
      <Trigger asChild>{trigger}</Trigger>

      {/* CONTENT */}
      <Portal>
        <Wrapper>
          <Overlay
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          />
          {content}
        </Wrapper>
      </Portal>
    </Root>
  )
}

interface DialogContentProps {
  // title: string
  // description?: string
  children: React.ReactNode
  // action: string
  // onAction: (close: VoidFunction) => void
  // onCancel?: () => void
  initialFocusRef?: React.RefObject<HTMLElement>
}

const DialogContent = (props: DialogContentProps, ref: Ref<HTMLDivElement>) => {
  const { children, initialFocusRef } = props

  const handleOpenAutoFocus = (event: Event) => {
    if (initialFocusRef?.current) {
      event.preventDefault()
      initialFocusRef.current.focus()
    }
  }

  const media = useMedia()

  if (media.sm) {
    return <Sheet.Content>{children}</Sheet.Content>
  }

  return (
    <Content
      ref={ref}
      onOpenAutoFocus={handleOpenAutoFocus}
      style={{
        backgroundColor: 'white',
        padding: 8,
        width: 400,
        borderRadius: 8,
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {children}
    </Content>
  )
}

Dialog.Content = forwardRef(DialogContent)

export { Dialog }
