import { cloneElement, forwardRef } from 'react'

import {
  CheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import { Stack, styled } from '@tamagui/core'

import { Checkbox } from '../selectors'
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
  selected?: boolean
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

interface DropdownMenuCheckboxItemProps {
  icon: React.ReactElement
  label: string
  onSelect: () => void
  checked?: boolean
  danger?: boolean
}

const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(function _DropdownMenuCheckboxItem(props, forwardedRef) {
  const { checked, label, icon, onSelect } = props

  const handleSelect = (event: Event) => {
    event.preventDefault()
    onSelect()
  }

  return (
    <ItemBaseCheckbox {...props} ref={forwardedRef} onSelect={handleSelect}>
      <Stack flexDirection="row" gap={8} alignItems="center">
        {cloneElement(icon)}
        <Text size={15} weight="medium" color="$neutral-100">
          {label}
        </Text>
      </Stack>
      <Checkbox id={label} selected={checked} variant="outline" />
    </ItemBaseCheckbox>
  )
})

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

const ItemBaseCheckbox = styled(CheckboxItem, {
  name: 'DropdownMenuCheckboxItem',
  acceptsClassName: true,

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

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
DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem

export { DropdownMenu }
export type DropdownMenuProps = Omit<Props, 'children'>
