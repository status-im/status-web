import { forwardRef } from 'react'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cva } from 'cva'
import Image from 'next/image'

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
    'z-[60]',
  ],
})

export const Content = forwardRef<
  React.ElementRef<typeof DropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenu.Content>
>((props, ref) => {
  const {
    align = 'start',
    side = 'bottom',
    sideOffset = 4,
    children,
    ...contentProps
  } = props
  return (
    <DropdownMenu.Portal container={document.body}>
      <DropdownMenu.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...contentProps}
        className={contentStyles({ className: props.className })}
      >
        {children}
      </DropdownMenu.Content>
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
      className="p-2 text-13 font-500 text-neutral-50"
    />
  )
})

Label.displayName = DropdownMenu.Label.displayName

/**
 * Item
 */

type ItemProps = DropdownMenu.DropdownMenuItemProps & {
  label: string
  icon: string
  selected?: boolean
}

const itemStyles = cva({
  base: [
    'flex h-8 select-none items-center gap-2 rounded-8 px-2 text-15 transition-colors active:bg-neutral-10',
    'outline-none hover:bg-neutral-5 data-[highlighted]:bg-neutral-5',
  ],
})

const labelStyles = cva({
  base: ['flex-1 font-400'],
  variants: {
    selected: {
      false: ['font-400 text-neutral-100'],
      true: ['font-600 text-neutral-100'],
    },
  },
  defaultVariants: {
    selected: false,
  },
})

export const Item = forwardRef<
  React.ElementRef<typeof DropdownMenu.Item>,
  ItemProps
>((props, ref) => {
  const { label, icon, selected, ...itemProps } = props

  return (
    <DropdownMenu.Item {...itemProps} ref={ref} className={itemStyles()}>
      <Image
        src={`/vaults/${icon.toLowerCase()}.png`}
        alt={icon}
        width="20"
        height="20"
        className="size-5 shrink-0"
      />
      <span className={labelStyles({ selected })}>{label}</span>
    </DropdownMenu.Item>
  )
})
