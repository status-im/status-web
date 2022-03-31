import React from 'react'

import * as Primitive from '@radix-ui/react-dropdown-menu'

import * as Menu from '../menu'

import type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuTriggerProps,
} from '@radix-ui/react-dropdown-menu'

interface TriggerProps extends DropdownMenuTriggerProps {
  children: [React.ReactElement, React.ReactElement]
}

const DropdownMenuTrigger = (props: TriggerProps) => {
  const { children, ...triggerProps } = props

  const [trigger, content] = children

  return (
    <Primitive.Root>
      <Primitive.Trigger {...triggerProps} asChild>
        {trigger}
      </Primitive.Trigger>
      {content}
    </Primitive.Root>
  )
}

interface MenuProps extends DropdownMenuContentProps {
  children: React.ReactNode
}

const DropdownMenu = (props: MenuProps) => {
  const { children, align = 'start', sideOffset = 6, ...menuProps } = props

  return (
    <Menu.Content
      {...menuProps}
      as={Primitive.Content}
      align={align}
      sideOffset={sideOffset}
    >
      {children}
    </Menu.Content>
  )
}

const Item = (props: DropdownMenuItemProps & Menu.ItemProps) => {
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
      <DropdownMenu sideOffset={-1}>{children}</DropdownMenu>
    </Primitive.Root>
  )
}

const Separator = (props: DropdownMenuSeparatorProps) => {
  return <Menu.Separator as={Primitive.Separator} {...props} />
}

DropdownMenu.Item = Item
DropdownMenu.TriggerItem = TriggerItem
DropdownMenu.Separator = Separator

export { DropdownMenu, DropdownMenuTrigger }
