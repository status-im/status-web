import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon, ExternalIcon } from '@status-im/icons/20'
import { Button, Link } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'

import { NETWORK_DOCS_URL } from '~/constants/network-details'

import { RejectIcon } from './icons'

type Props = {
  open: boolean
  onClose: () => void
  onRetry: () => void
  description?: string
  showNetworkDetails?: boolean
}

const NetworkSwitchErrorDialog = ({
  open,
  onClose,
  onRetry,
  description,
  showNetworkDetails = true,
}: Props) => {
  const t = useTranslations()
  const defaultDescription = t(
    'network_switch_error.description_status_network'
  )

  return (
    <Dialog.Root open={open} onOpenChange={nextOpen => !nextOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-x-0 top-0 z-50 flex size-full flex-col items-center justify-center p-4 focus:outline-none md:left-1/2 md:top-1/2 md:h-auto md:max-w-[440px] md:-translate-x-1/2 md:-translate-y-1/2 md:py-0"
          onPointerDownOutside={e => e.preventDefault()}
          onInteractOutside={e => e.preventDefault()}
        >
          <div className="relative mx-auto w-full overflow-y-auto rounded-20 bg-white-100 shadow-3 max-md:max-h-full md:w-[440px]">
            <Dialog.Close asChild>
              <button
                aria-label={t('common.close_aria')}
                className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-12 border border-neutral-20 p-2 transition-colors hover:bg-neutral-20 focus:outline-none focus:ring-2 focus:ring-neutral-40"
              >
                <CloseIcon className="text-neutral-100" />
              </button>
            </Dialog.Close>
            <div className="flex flex-col items-center gap-4 p-8 pt-12">
              <RejectIcon />
              <Dialog.Title asChild>
                <h2 className="text-center text-19 font-semibold text-neutral-100">
                  {t('network_switch_error.title')}
                </h2>
              </Dialog.Title>
              <Dialog.Description asChild>
                <p className="text-center text-15 text-neutral-100">
                  {description ?? defaultDescription}
                </p>
              </Dialog.Description>
              {showNetworkDetails && (
                <Link
                  href={NETWORK_DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-purple hover:text-purple-dark"
                >
                  {t('network_switch_error.network_details')}
                  <ExternalIcon />
                </Link>
              )}
              <div className="mt-2 flex w-full flex-col gap-3 md:flex-row">
                <Button
                  onClick={onClose}
                  size="40"
                  variant="outline"
                  type="button"
                  className="w-full justify-center md:flex-1"
                >
                  {t('common.close')}
                </Button>
                <Button
                  onClick={onRetry}
                  size="40"
                  variant="primary"
                  className="w-full justify-center md:flex-1"
                >
                  {t('network_switch_error.retry')}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { NetworkSwitchErrorDialog }
