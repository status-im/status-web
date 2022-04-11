import React, { cloneElement, useState } from 'react'

import * as Primitive from '@radix-ui/react-context-menu'

import * as Menu from '../menu'

import type {
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuTriggerProps,
} from '@radix-ui/react-context-menu'

interface TriggerProps extends ContextMenuTriggerProps {
  children: [React.ReactElement, React.ReactElement]
}

const ContextMenuTrigger = (props: TriggerProps) => {
  const { children, ...triggerProps } = props

  const [open, setOpen] = useState(false)

  const [trigger, menu] = children

  return (
    <Primitive.Root onOpenChange={setOpen}>
      <Primitive.Trigger {...triggerProps} asChild>
        {cloneElement(trigger, { 'data-open': open })}
      </Primitive.Trigger>
      {menu}
    </Primitive.Root>
  )
}

interface MenuProps extends ContextMenuContentProps {
  children: React.ReactNode
}

const ContextMenu = (props: MenuProps) => {
  const { children, sideOffset = 6, ...menuProps } = props

  return (
    <Menu.Content {...menuProps} as={Primitive.Content} sideOffset={sideOffset}>
      {children}
    </Menu.Content>
  )
}

const Item = (props: ContextMenuItemProps & Menu.ItemProps) => {
  return <Menu.Item as={Primitive.Item} {...props} />
}

interface TriggerItemProps extends Menu.TriggerItemProps {
  label: string
  children: React.ReactElement[] | React.ReactElement
}

const TriggerItem = (props: TriggerItemProps) => {
  const { label, children, ...itemProps } = props

  return (
    <Primitive.Root>
      <Menu.TriggerItem as={Primitive.TriggerItem} {...itemProps}>
        {label}
      </Menu.TriggerItem>
      <ContextMenu sideOffset={-1}>{children}</ContextMenu>
    </Primitive.Root>
  )
}

const Separator = (props: ContextMenuSeparatorProps) => {
  return <Menu.Separator as={Primitive.Separator} {...props} />
}

ContextMenu.Item = Item
ContextMenu.TriggerItem = TriggerItem
ContextMenu.Separator = Separator

export { ContextMenu, ContextMenuTrigger }
