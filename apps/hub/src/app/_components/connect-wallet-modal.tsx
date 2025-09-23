'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@status-im/components'
import { CloseIcon, ExternalIcon } from '@status-im/icons/20'
import Image from 'next/image'

type Props = {
  open: boolean
  onClose: () => void
}

const ConnectWalletModal = (props: Props) => {
  const { open, onClose } = props

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 min-h-[432px] w-full max-w-[1112px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div className="min-h-[inherit] w-full rounded-24 p-px shadow-3">
            <div className="absolute inset-0 h-full rounded-24 bg-[url('/modal/bg-gradient.png')] bg-cover bg-center" />

            <div className="relative z-10 w-full">
              <Dialog.Close
                asChild
                aria-label="Close"
                className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-blur-white/70 text-white-100 transition hover:bg-white-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-100"
              >
                <Button
                  icon={<CloseIcon />}
                  aria-label="Close"
                  variant="grey"
                  size="40"
                />
              </Dialog.Close>
              <div className="relative mb-10 flex justify-center sm:absolute sm:left-10 sm:top-1/2 sm:mb-0 sm:h-[398px] sm:w-[444px] sm:-translate-y-1/2">
                <Image
                  src="/modal/connector-1.png"
                  alt="Status Wallet Connector"
                  width="265"
                  height="235"
                  className="absolute left-1/2 top-0"
                />
                <Image
                  src="/modal/connector-2.png"
                  alt="Status Wallet Connector"
                  width="359"
                  height="248"
                  className="absolute left-1/2 top-1/3 translate-x-20"
                />
                <Image
                  src="/modal/dragon.png"
                  alt="Dragon"
                  width="304"
                  height="211"
                  className="absolute left-1/2 top-4"
                />
              </div>

              <div className="flex flex-1 flex-col gap-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white-100 px-4 py-2 text-13 font-medium uppercase tracking-[0.08em] text-white-100">
                  Status Wallet Connector
                </span>

                <div className="space-y-4">
                  <Dialog.Title asChild>
                    <h2 className="text-56 font-bold leading-tight text-white-100">
                      Connect to
                      <br />
                      Status Network
                    </h2>
                  </Dialog.Title>

                  <Dialog.Description asChild>
                    <p className="max-w-[360px] text-19 text-white-100">
                      Use Status L2 features in Chrome with the safety and
                      control of Status.
                    </p>
                  </Dialog.Description>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex items-center gap-3 rounded-24 bg-white-100 px-6 py-3 text-19 font-semibold text-neutral-90 transition hover:bg-white-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-100"
                  >
                    Install Status Wallet Connector
                    <ExternalIcon className="size-4" />
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-24 border border-white-100 px-6 py-3 text-19 font-semibold text-white-100 transition hover:border-white-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white-100"
                  >
                    Choose other wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ConnectWalletModal }
