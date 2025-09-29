import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'
import { QRCodeSVG } from 'qrcode.react'

type Props = {
  value: string
  children: React.ReactElement
}

export const QrDialog = (props: Props) => {
  const { value, children } = props

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#000]/[50%] backdrop-blur" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center focus:outline-none">
          <div>
            <div className="flex flex-col items-center gap-4">
              <div className="aspect-square w-full max-w-[335px] rounded-16 bg-white-5 p-3">
                <div className="rounded-12 bg-white-100 p-3">
                  <QRCodeSVG value={value} height={286} width={286} />
                </div>
              </div>
              <Dialog.Description className="text-13 text-blur-white/70">
                Scan with Status Desktop or Status Mobile
              </Dialog.Description>
            </div>

            <div
              className="absolute right-5 top-5"
              data-theme="dark"
              data-background="blur"
            >
              <Dialog.Close asChild>
                <Button
                  icon={<CloseIcon />}
                  size="32"
                  variant="outline"
                  aria-label="Close"
                />
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
