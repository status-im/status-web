import React from 'react'

import * as Collapsible from '@radix-ui/react-collapsible'

import { BellIcon } from '~/src/icons/bell-icon'
import { ChevronDownIcon } from '~/src/icons/chevron-down-icon'
import { styled } from '~/src/styles/config'
import { ContextMenu, ContextMenuTrigger, Text } from '~/src/system'

interface Props {
  name: string
  children: React.ReactNode
}

export const ChannelGroup = (props: Props) => {
  const { name, children } = props

  return (
    <ContextMenuTrigger>
      <Collapsible.Root defaultOpen>
        <CollapsibleTrigger>
          <Text size="15" weight="500" color="accent">
            {name}
          </Text>
          <ChevronDownIcon />
        </CollapsibleTrigger>
        <CollapsibleContent>{children}</CollapsibleContent>
      </Collapsible.Root>
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
    </ContextMenuTrigger>
  )
}

const CollapsibleTrigger = styled(Collapsible.Trigger, {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 8,
  borderRadius: 8,
  height: 34,
  color: '$accent-1',

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
