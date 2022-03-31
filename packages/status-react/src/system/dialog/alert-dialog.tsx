import React from 'react'

import * as Primitive from '@radix-ui/react-alert-dialog'

import { CrossIcon } from '~/src/icons/cross-icon'

import { Button } from '../button'
import { Heading } from '../heading'
import { IconButton } from '../icon-button'
import { Text } from '../text'
import { Actions, Body, Content, Header, Overlay } from './styles'

interface TriggerProps {
  children: [React.ReactElement, React.ReactElement]
}

const AlertDialogTrigger = (props: TriggerProps) => {
  const { children } = props

  const [trigger, content] = children

  return (
    <Primitive.Root>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>

      {content}
    </Primitive.Root>
  )
}

interface DialogProps {
  title: string
  description: string
  actionLabel: string
  cancelLabel?: string
}

const AlertDialog = (props: DialogProps) => {
  const { title, description, cancelLabel = 'Cancel', actionLabel } = props

  return (
    <Primitive.Portal>
      <Overlay as={Primitive.Overlay} />
      <Content as={Primitive.Content}>
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
            <Button>{actionLabel}</Button>
          </Primitive.Action>
        </Actions>
      </Content>
    </Primitive.Portal>
  )
}

export { AlertDialog, AlertDialogTrigger }
