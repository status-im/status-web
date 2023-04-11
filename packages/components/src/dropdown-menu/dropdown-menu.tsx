import { cloneElement } from 'react'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import { styled } from '@tamagui/core'

import { Text } from '../text'

interface Props {
  children: [React.ReactElement, React.ReactElement]
  modal?: false
  onOpenChange?: (open: boolean) => void
}

const DropdownMenu = (props: Props) => {
  const { children, onOpenChange, modal } = props

  const [trigger, content] = children

  return (
    <Root onOpenChange={onOpenChange} modal={modal}>
      <Trigger asChild>{trigger}</Trigger>
      <Portal>{content}</Portal>
    </Root>
  )
}

interface DropdownMenuItemProps {
  icon: React.ReactElement
  label: string
  onSelect: () => void
  danger?: boolean
}

const MenuItem = (props: DropdownMenuItemProps) => {
  const { icon, label, onSelect, danger } = props

  const iconColor = danger ? '$danger-50' : '$neutral-50'
  const textColor = danger ? '$danger-50' : '$neutral-100'

  return (
    <ItemBase onSelect={onSelect}>
      {cloneElement(icon, { color: iconColor })}
      <Text size={15} weight="medium" color={textColor}>
        {label}
      </Text>
    </ItemBase>
  )
}

const Content = styled(DropdownMenuContent, {
  name: 'DropdownMenuContent',
  acceptsClassName: true,

  width: 256,
  padding: 4,
  borderRadius: '$12',
  backgroundColor: '$white-100',

  shadowRadius: 30,
  shadowOffset: '0px 8px',
  shadowColor: 'rgba(9, 16, 28, 0.12)',
})

const ItemBase = styled(DropdownMenuItem, {
  name: 'DropdownMenuItem',
  acceptsClassName: true,

  display: 'flex',
  alignItems: 'center',
  height: 32,
  paddingHorizontal: 8,
  borderRadius: '$10',
  cursor: 'pointer',
  userSelect: 'none',
  gap: 8,

  hoverStyle: {
    backgroundColor: '$neutral-5',
  },

  pressStyle: {
    backgroundColor: '$neutral-10',
  },
})

const Separator = styled(DropdownMenuSeparator, {
  name: 'DropdownMenuSeparator',
  acceptsClassName: true,

  height: 1,
  backgroundColor: '$neutral-10',
  marginVertical: 4,
  marginLeft: -4,
  marginRight: -4,
})

DropdownMenu.Content = Content
DropdownMenu.Item = MenuItem
DropdownMenu.Separator = Separator

export { DropdownMenu }
export type DropdownMenuProps = Omit<Props, 'children'>
