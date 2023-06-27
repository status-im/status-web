import { cloneElement, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Button, Text } from '@status-im/components'
import { CloseIcon } from '@status-im/icons'
import { QRCodeSVG } from 'qrcode.react'

type Props = {
  value: string
  children: React.ReactElement
}

export const QrDialog = (props: Props) => {
  const { value, children } = props

  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {cloneElement(children, { onPress: () => setOpen(true) })}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-overlayShow fixed inset-0 bg-[#000]/50 backdrop-blur" />
        {/* <Dialog.Content className="inset-0 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"> */}
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed inset-0 flex items-center justify-center focus:outline-none">
          <div>
            <div className="flex flex-col items-center gap-4">
              <div className="aspect-square w-full max-w-[335px] rounded-2xl bg-white-5 p-3">
                <div className="rounded-xl bg-white-100 p-3">
                  <QRCodeSVG value={value} height={286} width={286} />
                </div>
              </div>
              <Text size={13} color="$white-70">
                Scan with Status Desktop or Status Mobile
              </Text>
            </div>

            <div className="absolute right-5 top-5">
              <Button
                icon={<CloseIcon size={20} />}
                size={32}
                variant="outline"
                onPress={() => setOpen(false)}
              />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
