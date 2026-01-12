'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Tag } from '@status-im/components'
import { CloseIcon, ExternalIcon } from '@status-im/icons/20'
import { Button, ButtonLink } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const PromoModal = (props: Props) => {
  const { open, onClose, children } = props
  const t = useTranslations()

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
                aria-label={t('common.close')}
                className="flex size-10 items-center justify-center rounded-12 bg-white-20 p-2 backdrop-blur-2xl hover:bg-white-30"
              >
                <CloseIcon className="text-white-100" />
              </button>
            </Dialog.Close>
          </div>
          <div className="relative min-h-[inherit] w-full overflow-hidden rounded-40 shadow-3">
            <div className="absolute inset-0 h-full rounded-40 bg-[url('/modal/bg-gradient.png')] bg-cover bg-center" />

            <div className="relative z-10 flex flex-col gap-12 rounded-40 p-10 text-white-100 md:flex-row md:items-end md:justify-between">
              <div className="h-full max-w-[575px] space-y-4">
                <Tag label={t('stake.promo_modal.wallet_connector_tag')} />

                <div className="space-y-1">
                  <Dialog.Title asChild>
                    <h2 className="text-40 font-bold text-white-100">
                      {t('stake.promo_modal.connect_to_network_title')}
                    </h2>
                  </Dialog.Title>

                  <Dialog.Description asChild>
                    <p className="max-w-[325px] text-19 font-medium text-white-100">
                      {t('stake.promo_modal.description')}
                    </p>
                  </Dialog.Description>
                </div>

                <div className="mt-6 flex flex-col gap-6 sm:flex-row">
                  <ButtonLink
                    variant="white"
                    href="https://chromewebstore.google.com/detail/a-wallet-connector-by-sta/kahehnbpamjplefhpkhafinaodkkenpg"
                    className="text-purple"
                  >
                    {t('stake.promo_modal.install_connector')}
                    <ExternalIcon className="size-4" />
                  </ButtonLink>

                  <ConnectKitButton.Custom>
                    {({ show, isConnected }) => (
                      <Button
                        onClick={show}
                        variant={isConnected ? 'secondary' : 'primary'}
                      >
                        {isConnected
                          ? t('stake.promo_modal.connected')
                          : t('stake.connect_wallet')}
                      </Button>
                    )}
                  </ConnectKitButton.Custom>
                </div>
              </div>

              <div className="relative mx-auto h-[398px] w-full max-w-[444px] md:mx-0">
                <Image
                  src="/modal/connector-1.png"
                  alt={t('stake.promo_modal.connector_alt')}
                  width="265"
                  height="235"
                  className="absolute -left-1/4 top-0 translate-x-14 scale-[120%]"
                />
                <Image
                  src="/modal/connector-2.png"
                  alt={t('stake.promo_modal.connector_alt')}
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
