'use client'

import * as Drawer from '../drawer'

export type ExchangeDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactElement
  children?: React.ReactNode
}

export const ExchangeDrawer = (props: ExchangeDrawerProps) => {
  const { open, onOpenChange, trigger, children } = props

  return (
    <Drawer.Root modal open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Content className="p-0">
        <Drawer.Title className="sr-only">Exchange</Drawer.Title>
        <Drawer.Body className="h-full overflow-hidden">
          <div className="size-full">{children}</div>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}
