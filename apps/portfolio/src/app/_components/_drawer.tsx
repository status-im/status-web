// note: from admin

import { forwardRef } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon } from '@status-im/icons/20'
import { cva, cx, type VariantProps } from 'class-variance-authority'

const Root = Dialog.Root

const Trigger = Dialog.Trigger

const Close = Dialog.Close

const Portal = Dialog.Portal

const Overlay = forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    className={cx(
      'fixed inset-0 bg-blur-neutral-100/70 opacity-[30%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%]',
      className
    )}
    {...props}
    ref={ref}
  />
))
Overlay.displayName = Dialog.Overlay.displayName

const contentStyles = cva(
  'shadow fixed z-auto flex flex-col gap-3 rounded-16 border border-neutral-10 bg-white-100 px-3 py-4 transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
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
    VariantProps<typeof contentStyles> {}

const Content = forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  ContentProps
>(({ side, className, children, ...props }, ref) => {
  return (
    <Portal>
      <Overlay />
      <Dialog.Content
        ref={ref}
        className={cx(contentStyles({ side }), className)}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-3 top-3 z-40 rounded-10 border border-neutral-30 p-1.5 transition-colors active:border-neutral-50 hover:border-neutral-40 disabled:pointer-events-none">
          <span className="sr-only">Close</span>
          <CloseIcon className="text-neutral-100" />
        </Dialog.Close>
      </Dialog.Content>
    </Portal>
  )
})

Content.displayName = Dialog.Content.displayName

const Header = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx('flex flex-col text-left text-19 font-bold', className)}
    {...props}
  />
)
Header.displayName = 'DrawerHeader'

const Filters = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx('flex flex-col pt-2', className)} {...props}>
    <div className="flex flex-col pb-3">
      <div className="flex flex-row items-stretch gap-2">{children}</div>
    </div>
    <div className="-mx-3 mt-1 h-px bg-neutral-10" />
  </div>
)

Filters.displayName = 'DrawerFilters'

const Body = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx('flex flex-1 flex-col overflow-auto', className)}
    {...props}
  />
)
Body.displayName = 'DrawerBody'

const Footer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cx(
      'flex flex-col-reverse justify-end sm:flex-row sm:space-x-2',
      className
    )}
    {...props}
  />
)
Footer.displayName = 'DrawerFooter'

const Title = forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cx('pb-2 text-19 font-semibold text-neutral-100', className)}
    {...props}
  />
))
Title.displayName = Dialog.Title.displayName

export {
  Body,
  Close,
  Content,
  Filters,
  Footer,
  Header,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
}
