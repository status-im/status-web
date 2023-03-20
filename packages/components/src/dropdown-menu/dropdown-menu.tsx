import { cloneElement } from 'react'

import {
  DropdownMenuContent,
  DropdownMenuItem as RadixDropdownMenuItem,
  DropdownMenuSeparator,
  // Label,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import { Stack, styled } from 'tamagui'

import { Text } from '../text'

const Content = styled(DropdownMenuContent, {
  name: 'DropdownMenuContent',
  acceptsClassName: true,

  width: 352,
  padding: 8,
  borderRadius: 16,
  backgroundColor: '$white-100',

  shadowRadius: 30,
  shadowOffset: '0px 8px',
  shadowColor: 'rgba(9, 16, 28, 0.12)',
})

const Item = styled(RadixDropdownMenuItem, {
  name: 'DropdownMenuItem',
  acceptsClassName: true,

  display: 'flex',
  alignItems: 'center',
  padding: 8,
  borderRadius: 12,
  cursor: 'pointer',
  userSelect: 'none',

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
  marginVertical: 8,
  marginLeft: -8,
  marginRight: -8,
})

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

const DropdownMenuItem = (props: DropdownMenuItemProps) => {
  const { icon, label, onSelect, danger } = props

  const iconColor = danger ? '$danger-50' : '$neutral-50'
  const textColor = danger ? '$danger-50' : '$neutral-100'

  return (
    <Item onSelect={onSelect}>
      <Stack marginRight={12}>{cloneElement(icon, { color: iconColor })}</Stack>
      <Text size={15} weight="medium" color={textColor}>
        {label}
      </Text>
    </Item>
  )
}

DropdownMenu.Content = Content
DropdownMenu.Item = DropdownMenuItem
DropdownMenu.Separator = Separator

export { DropdownMenu }
export type { Props as DropdownMenuProps }
