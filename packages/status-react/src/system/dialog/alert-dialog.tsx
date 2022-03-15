import React from 'react'

import * as Primitive from '@radix-ui/react-alert-dialog'

import { CrossIcon } from '~/src/icons/cross-icon'

import { Button } from '../button'
import { IconButton } from '../icon-button'
import { Text } from '../text'
import { Actions, Body, Content, Header, Overlay, Title } from './styles'

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
  // actionLabel: string
  // cancelLabel?: string
}

const AlertDialog = (props: DialogProps) => {
  const { title, description } = props

  return (
    <Primitive.Portal>
      <Overlay as={Primitive.Overlay} />
      <Content as={Primitive.Content}>
        <Header>
          <Title as={Primitive.Title}>{title}</Title>
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
            <Button>Cancel</Button>
          </Primitive.Cancel>
          <Primitive.Action asChild>
            <Button>Action</Button>
          </Primitive.Action>
        </Actions>
      </Content>
    </Primitive.Portal>
  )
}

export { AlertDialog, AlertDialogTrigger }
