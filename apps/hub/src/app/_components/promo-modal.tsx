'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Tag } from '@status-im/components'
import { CloseIcon, ExternalIcon } from '@status-im/icons/20'
import { Button, ButtonLink } from '@status-im/status-network/components'
import Image from 'next/image'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const PromoModal = (props: Props) => {
  const { open, onClose, children } = props

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 min-h-[432px] w-full max-w-[1112px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div
            data-background="blur"
            className="absolute right-8 top-4 z-50 size-10"
          >
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="flex size-10 items-center justify-center rounded-12 bg-white-20 p-2 backdrop-blur-2xl hover:bg-white-30"
              >
                <CloseIcon />
              </button>
            </Dialog.Close>
          </div>
          <div className="relative min-h-[inherit] w-full overflow-hidden rounded-40 shadow-3">
            <div className="absolute inset-0 h-full rounded-40 bg-[url('/modal/bg-gradient.png')] bg-cover bg-center" />

            <div className="relative z-10 flex flex-col gap-12 rounded-40 p-10 text-white-100 md:flex-row md:items-end md:justify-between">
              <div className="h-full max-w-[575px] space-y-4">
                <Tag label="Status Wallet Connector" />

                <div className="space-y-1">
                  <Dialog.Title asChild>
                    <h2 className="text-40 font-bold text-white-100">
                      Connect to
                      <br />
                      Status Network
                    </h2>
                  </Dialog.Title>

                  <Dialog.Description asChild>
                    <p className="max-w-[325px] text-19 font-medium text-white-100">
                      Use Status L2 features in Chrome with the safety and
                      control of Status.
                    </p>
                  </Dialog.Description>
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row">
                  <ButtonLink
                    variant="white"
                    href="https://chromewebstore.google.com/detail/a-wallet-connector-by-sta/kahehnbpamjplefhpkhafinaodkkenpg"
                    className="text-purple"
                  >
                    Install Status Wallet Connector
                    <ExternalIcon className="size-4" />
                  </ButtonLink>

                  {/* TODO: Implement connect wallet flow through provider */}
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="text-white-100"
                  >
                    Choose other wallet
                  </Button>
                </div>
              </div>

              <div className="relative mx-auto h-[398px] w-full max-w-[444px] md:mx-0">
                <Image
                  src="/modal/connector-1.png"
                  alt="Status Wallet Connector"
                  width="265"
                  height="235"
                  className="absolute -left-1/4 top-0 translate-x-14 scale-[120%]"
                />
                <Image
                  src="/modal/connector-2.png"
                  alt="Status Wallet Connector"
                  width="359"
                  height="248"
                  className="absolute bottom-2 right-8 scale-[120%]"
                />
                <Image
                  src="/modal/dragon.png"
                  alt="Dragon"
                  width="304"
                  height="211"
                  className="absolute right-0 top-[-32px]"
                />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { PromoModal }
