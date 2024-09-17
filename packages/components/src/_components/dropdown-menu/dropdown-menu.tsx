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
import { CheckIcon } from '@status-im/icons/20'

import { Checkbox } from '../checkbox'
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
  icon?: React.ReactElement
  label: string
  onSelect: () => void
  selected?: boolean
  danger?: boolean
}

const MenuItem = (props: DropdownMenuItemProps) => {
  const { icon, label, onSelect, danger, selected } = props

  const iconColor = danger ? 'text-danger-50' : 'text-neutral-50'
  const textColor = danger ? 'text-danger-50' : 'text-neutral-100'

  return (
    <DropdownMenuItem
      onSelect={onSelect}
      className="rounded-lg flex h-8 cursor-pointer select-none items-center justify-between gap-2 px-2 active:bg-neutral-10 hover:bg-neutral-5"
    >
      <div className="flex flex-row items-center gap-2">
        {icon && cloneElement(icon, { className: iconColor })}
        <Text size={15} weight="medium" className={textColor}>
          {label}
        </Text>
      </div>
      {selected && <CheckIcon className={iconColor} />}
    </DropdownMenuItem>
  )
}

interface DropdownMenuCheckboxItemProps {
  icon?: React.ReactElement
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
    <CheckboxItem
      {...props}
      ref={forwardedRef}
      onSelect={handleSelect}
      className="rounded-lg flex h-8 cursor-pointer select-none items-center justify-between gap-2 px-2 active:bg-neutral-10 hover:bg-neutral-5"
    >
      <div className="flex flex-row items-center gap-2">
        {icon && cloneElement(icon)}
        <Text size={15} weight="medium" className="text-neutral-100">
          {label}
        </Text>
      </div>
      <Checkbox id={label} isSelected={checked} variant="outline" />
    </CheckboxItem>
  )
})

const Content = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContent>
>((props, forwardedRef) => (
  <DropdownMenuContent
    {...props}
    ref={forwardedRef}
    className="rounded-xl w-64 bg-white-100 p-1 shadow-[0_8px_30px_rgba(9,16,28,0.12)]"
  />
))
Content.displayName = 'Content'

const Separator = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSeparator>
>((props, forwardedRef) => (
  <DropdownMenuSeparator
    {...props}
    ref={forwardedRef}
    className="-mx-1 my-1 h-px bg-neutral-10"
  />
))
Separator.displayName = 'Separator'

DropdownMenu.Content = Content
DropdownMenu.Item = MenuItem
DropdownMenu.Separator = Separator
DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem

export { DropdownMenu }
export type DropdownMenuProps = Omit<Props, 'children'>
