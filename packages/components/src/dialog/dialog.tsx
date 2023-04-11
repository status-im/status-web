import { cloneElement, forwardRef } from 'react'

import {
  Close,
  Content,
  Overlay,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dialog'

import type { DialogTriggerProps } from '@radix-ui/react-dialog'
import type { Ref } from 'react'
import type React from 'react'

interface Props {
  children: [React.ReactElement, React.ReactElement]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  press?: 'normal' | 'long'
}

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
  borderRadius: '$8' | '$12' | '$16'
  width: number
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
      // TODO: use tamagui components
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: props.borderRadius,
        width: props.width,
      }}
    >
      {children}
    </Content>
  )
}

Dialog.Content = forwardRef(DialogContent)

export { Close, Dialog }
