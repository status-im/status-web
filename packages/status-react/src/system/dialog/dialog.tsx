import React, { useState } from 'react'

import * as Primitive from '@radix-ui/react-dialog'

import { CrossIcon } from '~/src/icons/cross-icon'

import { Button } from '../button'
import { IconButton } from '../icon-button'
import { Actions, Body, Content, Header, Overlay, Title } from './styles'

interface DialogTriggerProps {
  children: [React.ReactElement, React.ReactElement]
}

const DialogTrigger = (props: DialogTriggerProps) => {
  const { children } = props

  const [open, setOpen] = useState(false)

  const [trigger, content] = children

  return (
    <Primitive.Root open={open} onOpenChange={setOpen}>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      {content}
    </Primitive.Root>
  )
}

interface DialogProps {
  title: React.ReactNode
  children: React.ReactNode
  actionLabel: string
  cancelLabel?: string
}

const Dialog = (props: DialogProps) => {
  const { title, children, actionLabel, cancelLabel } = props

  return (
    <Primitive.Portal>
      <Overlay />
      <Content>
        <Header>
          <Title>{title}</Title>
          <Primitive.Close asChild>
            <IconButton label="Close">
              <CrossIcon />
            </IconButton>
          </Primitive.Close>
        </Header>
        <Body>{children}</Body>
        <Actions>
          {cancelLabel && (
            <Primitive.Close asChild>
              <Button>{cancelLabel}</Button>
            </Primitive.Close>
          )}
          <Button>{actionLabel}</Button>
        </Actions>
      </Content>
    </Primitive.Portal>
  )
}

export { Dialog, DialogTrigger }
export type { DialogProps, DialogTriggerProps }
