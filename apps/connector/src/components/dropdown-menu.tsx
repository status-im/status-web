import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Root,
  Trigger,
} from '@radix-ui/react-dropdown-menu'
import { cx } from 'cva'

type Props = {
  children: [React.ReactElement, React.ReactElement]
  modal?: boolean
  onOpenChange?: (open: boolean) => void
}

const DropdownMenu = (props: Props) => {
  const { children, onOpenChange, modal } = props

  const [trigger, content] = children

  return (
    <Root onOpenChange={onOpenChange} modal={modal}>
      <Trigger asChild>{trigger}</Trigger>
      {content}
    </Root>
  )
}

type DropdownMenuItemProps = {
  label: string
  onSelect: () => void
}

const MenuItem = (props: DropdownMenuItemProps) => {
  const { label, onSelect } = props

  return (
    <ItemBase onSelect={onSelect}>
      <div className="flex items-center gap-8">
        <p className="text-15 font-medium text-neutral-100">{label}</p>
      </div>
    </ItemBase>
  )
}

const Content = (props: React.ComponentProps<typeof DropdownMenuContent>) => {
  return (
    <DropdownMenuContent
      {...props}
      className={cx('w-64 p-1 rounded-xl bg-white-100', 'shadow-3 ')}
    />
  )
}

const ItemBase = (props: React.ComponentProps<typeof DropdownMenuItem>) => {
  return (
    <DropdownMenuItem
      {...props}
      className="flex h-8 cursor-pointer select-none items-center justify-between gap-2 rounded-[10px] px-2 transition-colors hover:bg-neutral-5"
    />
  )
}

const Separator = (
  props: React.ComponentProps<typeof DropdownMenuSeparator>,
) => {
  return (
    <DropdownMenuSeparator
      {...props}
      className="mx-[-4px] my-1 h-px bg-neutral-10"
    />
  )
}

DropdownMenu.Content = Content
DropdownMenu.Item = MenuItem
DropdownMenu.Separator = Separator

export { DropdownMenu }
export type DropdownMenuProps = Omit<Props, 'children'>
