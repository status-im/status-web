import { forwardRef } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'
import { cva, cx, type VariantProps } from 'class-variance-authority'

import * as Drawer from '../_components/_drawer'

const Root = Drawer.Root

const Trigger = Drawer.Trigger

const Close = forwardRef<
  React.ElementRef<typeof Drawer.Close>,
  React.ComponentPropsWithoutRef<typeof Drawer.Close> & { children?: never }
>((props, ref) => (
  <div className="absolute right-3 top-3">
    <Drawer.Close {...props} ref={ref} asChild>
      <Button
        icon={<CloseIcon />}
        aria-label="Close"
        variant="outline"
        size="32"
      />
    </Drawer.Close>
  </div>
))

Close.displayName = Drawer.Close.displayName

const Portal = Drawer.Portal
const Footer = Drawer.Footer
const Header = Drawer.Header
const Title = Drawer.Title
const Body = Drawer.Body

const Overlay = forwardRef<
  React.ElementRef<typeof Drawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    className={cx(
      'fixed inset-0 bg-blur-neutral-100/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
      className
    )}
    {...props}
    ref={ref}
  />
))
Overlay.displayName = Dialog.Overlay.displayName

const drawerVariants = cva(
  'shadow fixed z-auto flex flex-col gap-3 rounded-16 border border-neutral-10 bg-white-100 opacity-[1] transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 left-3 top-3 h-[80vh] w-[calc(100%-23px)] border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-3 left-3 h-[80vh] w-[calc(100%-23px)] border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-3 top-3 h-[calc(100vh-24px)] w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-[494px]',
        right:
          'inset-y-0 right-3 top-3 h-[calc(100vh-24px)] w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-[494px]',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
)

interface ContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    VariantProps<typeof drawerVariants> {}

const Content = forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  ContentProps
>(({ side, className, children, ...props }, ref) => {
  return (
    <Portal>
      <Overlay />

      <Dialog.Content
        ref={ref}
        className={cx(drawerVariants({ side }), className)}
        {...props}
      >
        {children}
        <Close />
      </Dialog.Content>
    </Portal>
  )
})

Content.displayName = Dialog.Content.displayName

export {
  Body,
  Close,
  Content,
  Footer,
  Header,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
}
