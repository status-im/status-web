import { cloneElement, forwardRef, useId } from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  ArrowRightIcon,
  CheckIcon,
  ExternalIcon,
  SearchIcon,
} from '@status-im/icons/20'
import { cva } from 'cva'

import { Checkbox } from '../checkbox'
import { Input } from '../input'
import { Switch } from '../switch'

import type { IconElement } from '../types'

/**
 * Root
 */

type RootProps = DropdownMenu.DropdownMenuProps & {
  children: [React.ReactElement, React.ReactElement]
}

export const Root = (props: RootProps) => {
  const { children, ...rootProps } = props

  const [trigger, content] = children

  return (
    <DropdownMenu.Root {...rootProps}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      {content}
    </DropdownMenu.Root>
  )
}

/**
 * Content
 */

const contentStyles = cva({
  base: [
    'rounded-12 border border-neutral-10 bg-white-100 p-1 shadow-3',
    'max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-auto',
    'dark:border-neutral-90 dark:bg-neutral-95',
  ],
})

export const Content = forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  DropdownMenu.DropdownMenuContentProps
>((props, ref) => {
  const {
    align = 'start',
    side = 'bottom',
    sideOffset = 4,
    ...contentProps
  } = props
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...contentProps}
        className={contentStyles({ className: props.className })}
      />
    </DropdownMenu.Portal>
  )
})

Content.displayName = DropdownMenu.Content.displayName

/**
 * Label
 */

export const Label = forwardRef<
  React.ElementRef<typeof DropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Label>
>((props, ref) => {
  return (
    <DropdownMenu.Label
      {...props}
      ref={ref}
      className="p-2 text-13 font-medium text-neutral-50 dark:text-neutral-40"
    />
  )
})

Label.displayName = DropdownMenu.Label.displayName

/**
 * Search
 */

export const Search = forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>((props, ref) => {
  return (
    <div className="mb-1 p-1">
      <Input
        {...props}
        ref={ref}
        size="32"
        icon={<SearchIcon />}
        aria-label="Search"
      />
    </div>
  )
})

Search.displayName = 'Search'

/**
 * Item
 */

type ItemProps = DropdownMenu.DropdownMenuItemProps & {
  icon?: IconElement
  label: string
  // onSelect: NonNullable<DropdownMenu.DropdownMenuItemProps['onSelect']>
  selected?: boolean
  danger?: boolean
  external?: boolean
}

const itemStyles = cva({
  base: [
    'flex h-8 select-none items-center gap-2 rounded-8 px-2 text-15 transition-colors active:bg-neutral-10',
    'outline-none data-[highlighted]:bg-neutral-5',
    'dark:active:bg-customisation-50/10 dark:hover:bg-customisation-50/5',
  ],
})

const iconStyles = cva({
  base: ['size-5 [&>svg]:size-full'],
  variants: {
    danger: {
      false: ['text-neutral-50 dark:text-neutral-40'],
      true: ['text-danger-50'],
    },
  },
  defaultVariants: {
    danger: false,
  },
})

const labelStyles = cva({
  base: ['flex-1 font-medium'],
  variants: {
    danger: {
      false: ['text-neutral-100 dark:text-white-100'],
      true: ['text-danger-50 dark:text-danger-60'],
    },
  },
  defaultVariants: {
    danger: false,
  },
})

export const Item = forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  ItemProps
>((props, ref) => {
  const { icon, label, selected, danger, external, ...itemProps } = props

  return (
    <DropdownMenu.Item {...itemProps} ref={ref} className={itemStyles()}>
      {icon && (
        <span className={iconStyles({ danger })}>{cloneElement(icon)}</span>
      )}
      <span className={labelStyles({ danger })}>{label}</span>
      {selected && <CheckIcon className="text-customisation-50" />}
      {external && <ExternalIcon className="text-neutral-50" />}
    </DropdownMenu.Item>
  )
})

Item.displayName = DropdownMenu.Item.displayName

/**
 * CheckboxItem
 */

type CheckboxItemProps = DropdownMenu.DropdownMenuCheckboxItemProps & {
  icon?: IconElement
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  danger?: boolean
}

export const CheckboxItem = forwardRef<
  React.ElementRef<typeof DropdownMenu.CheckboxItem>,
  CheckboxItemProps
>((props, ref) => {
  const { label, icon, danger, ...itemProps } = props

  const id = useId()

  return (
    <DropdownMenu.CheckboxItem
      ref={ref}
      className={itemStyles()}
      {...itemProps}
    >
      {icon && (
        <span className={iconStyles({ danger })}>{cloneElement(icon)}</span>
      )}
      <span className={labelStyles({ danger })}>{label}</span>
      <Checkbox
        id={id}
        variant="outline"
        checked={itemProps.checked}
        onCheckedChange={() => {
          // handled by parent
        }}
      />
    </DropdownMenu.CheckboxItem>
  )
})

CheckboxItem.displayName = DropdownMenu.CheckboxItem.displayName

/**
 * SwitchItem
 */

type SwitchItemProps = DropdownMenu.DropdownMenuCheckboxItemProps & {
  icon?: IconElement
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  danger?: boolean
}

export const SwitchItem = forwardRef<
  React.ElementRef<typeof DropdownMenu.CheckboxItem>,
  SwitchItemProps
>((props, ref) => {
  const { label, icon, danger, ...itemProps } = props

  const id = useId()

  return (
    <DropdownMenu.CheckboxItem
      ref={ref}
      className={itemStyles()}
      {...itemProps}
    >
      {icon && (
        <span className={iconStyles({ danger })}>{cloneElement(icon)}</span>
      )}
      <span className={labelStyles({ danger })}>{label}</span>
      <Switch
        id={id}
        checked={itemProps.checked}
        onCheckedChange={() => {
          // handled by parent
        }}
      />
    </DropdownMenu.CheckboxItem>
  )
})

SwitchItem.displayName = 'DropdownMenuSwitchItem'

/**
 * Separator
 */
export const Separator = () => (
  <DropdownMenu.Separator className="-mx-1 my-1.5 h-px bg-neutral-20 dark:bg-neutral-80" />
)

/**
 * Submenu
 */
export const Sub = (props: DropdownMenu.DropdownMenuProps) => {
  return <DropdownMenu.Sub {...props} />
}

type SubTriggerProps = DropdownMenu.DropdownMenuSubTriggerProps & {
  icon?: IconElement
  label: string
  danger?: boolean
}

export const SubTrigger = (props: SubTriggerProps) => {
  const { icon, label, danger, ...itemProps } = props

  return (
    <DropdownMenu.SubTrigger
      {...itemProps}
      className={itemStyles({ className: 'aria-expanded:bg-neutral-5' })}
    >
      {icon && (
        <span className={iconStyles({ danger })}>{cloneElement(icon)}</span>
      )}
      <span className={labelStyles({ danger })}>{label}</span>
      <ArrowRightIcon className="text-neutral-50" />
    </DropdownMenu.SubTrigger>
  )
}

export const SubContent = forwardRef<
  React.ElementRef<typeof DropdownMenu.SubContent>,
  DropdownMenu.DropdownMenuSubContentProps
>((props, ref) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.SubContent
        {...props}
        ref={ref}
        className={contentStyles({ className: props.className })}
      >
        {props.children}
      </DropdownMenu.SubContent>
    </DropdownMenu.Portal>
  )
})

SubContent.displayName = DropdownMenu.SubContent.displayName
