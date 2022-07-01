import React, { cloneElement, useCallback, useRef } from 'react'

import * as Primitive from '@radix-ui/react-alert-dialog'

import { useDialogContext } from '../../contexts/dialog-context'
import { CrossIcon } from '../../icons/cross-icon'
import { Button } from '../button'
import { Heading } from '../heading'
import { IconButton } from '../icon-button'
import { Text } from '../text'
import { Actions, Body, Content, Header, Overlay } from './styles'

import type { ButtonProps } from '../button'
import type { DialogContentProps } from '@radix-ui/react-dialog'

interface TriggerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: [React.ReactElement, React.ReactElement]
}

const AlertDialogTrigger = (props: TriggerProps) => {
  const { children, open, onOpenChange, ...triggerProps } = props

  const [trigger, content] = children

  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Trigger asChild>
        {cloneElement(trigger, triggerProps)}
      </Primitive.Trigger>
      {content}
    </Primitive.Root>
  )
}

interface DialogProps {
  title: string
  description: string
  actionLabel: string
  actionVariant?: ButtonProps['variant']
  onAction: VoidFunction
  cancelLabel?: string
  onOpenAutoFocus?: DialogContentProps['onOpenAutoFocus']
  onCloseAutoFocus?: DialogContentProps['onCloseAutoFocus']
}

const AlertDialog = (props: DialogProps) => {
  const {
    title,
    description,
    actionLabel,
    actionVariant,
    onAction,
    cancelLabel = 'Cancel',
    ...contentProps
  } = props

  return (
    <Primitive.Portal>
      <Overlay as={Primitive.Overlay} />
      <Content as={Primitive.Content} {...contentProps}>
        <Header>
          <Heading as={Primitive.Title} weight="600" size="17">
            {title}
          </Heading>
          <Primitive.Cancel asChild>
            <IconButton label="Close">
              <CrossIcon />
            </IconButton>
          </Primitive.Cancel>
        </Header>
        <Body>
          <Text as={Primitive.Description}>{description}</Text>
        </Body>
        <Actions>
          <Primitive.Cancel asChild>
            <Button>{cancelLabel}</Button>
          </Primitive.Cancel>
          <Primitive.Action asChild>
            <Button variant={actionVariant} onClick={onAction}>
              {actionLabel}
            </Button>
          </Primitive.Action>
        </Actions>
      </Content>
    </Primitive.Portal>
  )
}

const useAlertDialog = (props: DialogProps) => {
  const render = useDialogContext()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleCloseAutoFocus = () => {
    triggerRef.current?.focus()
  }

  const open = useCallback(() => {
    render(
      <Primitive.Root>
        <AlertDialog {...props} onCloseAutoFocus={handleCloseAutoFocus} />
      </Primitive.Root>
    )
  }, [props, render])

  return { open, triggerRef }
}

export { AlertDialog, AlertDialogTrigger, useAlertDialog }
