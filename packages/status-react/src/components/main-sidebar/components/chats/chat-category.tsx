import React, { useState } from 'react'

import * as Collapsible from '@radix-ui/react-collapsible'

import { ChevronDownIcon } from '../../../../icons/chevron-down-icon'
import { useActiveChat } from '../../../../protocol/use-active-chat'
import { styled } from '../../../../styles/config'

import type { ChatItem } from './chat-item'

interface Props {
  name: string
  children: React.ReactNode
}

export const ChatCategory = (props: Props) => {
  const { name, children } = props
  const chat = useActiveChat()

  const [open, setOpen] = useState(true)

  // show active chat even though the category is closed
  const activeChild = React.Children.toArray(children).find(child => {
    if (React.isValidElement<React.ComponentProps<typeof ChatItem>>(child)) {
      return child.props.chat.id === chat?.uuid
    }
  })

  return (
    <>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          {name}
          <ChevronDownIcon />
        </CollapsibleTrigger>
        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible.Root>
      {open === false && activeChild}
    </>
  )
}

/* <ContextMenuTrigger>
<ContextMenu>
  <ContextMenu.TriggerItem label="Mute Category" icon={<BellIcon />}>
    <ContextMenu.Item>For 15 min</ContextMenu.Item>
    <ContextMenu.Item>For 1 hour</ContextMenu.Item>
    <ContextMenu.Item>For 8 hours</ContextMenu.Item>
    <ContextMenu.Item>For 24 hours</ContextMenu.Item>
    <ContextMenu.Item>Until I turn it back on</ContextMenu.Item>
  </ContextMenu.TriggerItem>
  <ContextMenu.Item icon={<BellIcon />}>Mark as Read</ContextMenu.Item>
</ContextMenu>
</ContextMenuTrigger> */

const CollapsibleTrigger = styled(Collapsible.Trigger, {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 8,
  borderRadius: 8,
  height: 34,
  fontWeight: '$500',
  color: '$accent-4',

  '&:hover': {
    background: '$gray-3',
  },

  '&[aria-expanded="true"] svg': {
    transform: 'rotate(180deg)',
  },
})

const CollapsibleContent = styled(Collapsible.Content, {
  overflow: 'hidden',
})
