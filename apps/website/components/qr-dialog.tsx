import { cloneElement, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Button, Text } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'

type Props = {
  children: React.ReactElement
}

export const QrDialog = (props: Props) => {
  const { children } = props

  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {cloneElement(children, { onPress: () => setOpen(true) })}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-[#000]/50 data-[state=open]:animate-overlayShow fixed inset-0 backdrop-blur" />
        {/* <Dialog.Content className="inset-0 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"> */}
        <Dialog.Content className="inset-0 data-[state=open]:animate-contentShow fixed focus:outline-none flex justify-center items-center">
          <div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-[100px] h-[100px] bg-gray-100 rounded">
                QR CODE
              </div>
              <Text size={13} color="$neutral-5-opa-70">
                Scan with Status Desktop or Status Mobile
              </Text>
            </div>

            <div className="absolute top-5 right-5">
              <Button
                icon={<CloseIcon />}
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
