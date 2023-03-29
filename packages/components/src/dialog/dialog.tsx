import { cloneElement, forwardRef } from 'react'

import { Content, Overlay, Portal, Root, Trigger } from '@radix-ui/react-dialog'
import { Stack, styled } from 'tamagui'

import type { DialogTriggerProps } from '@radix-ui/react-dialog'
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

// TODO: allow customization of press duration
const Dialog = (props: Props) => {
  const { children, open, onOpenChange, press = 'normal' } = props

  const [trigger, content] = children

  // const media = useMedia()

  // if (media.sm) {
  //   return (
  //     <Sheet>
  //       {trigger}
  //       {content}
  //     </Sheet>
  //   )
  // }

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      {/* TRIGGER */}
      <Trigger asChild>
        <PressableTrigger press={press}>{trigger}</PressableTrigger>
      </Trigger>

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

const PressableTrigger = forwardRef(function _PressableTrigger(
  props: DialogTriggerProps & {
    press: Props['press']
    children: React.ReactElement
  },
  ref
) {
  const { children, press, onClick, ...triggerProps } = props
  const handler = press === 'normal' ? 'onPress' : 'onLongPress'

  return cloneElement(children, { ref, ...triggerProps, [handler]: onClick })
})

interface DialogContentProps {
  children: React.ReactNode
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

  // const media = useMedia()

  // if (media.sm) {
  //   return <Sheet.Content>{children}</Sheet.Content>
  // }

  return (
    <Content
      ref={ref}
      onOpenAutoFocus={handleOpenAutoFocus}
      style={{
        backgroundColor: 'white',
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
