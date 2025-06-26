import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon } from '@status-im/icons/20'

import { RecoveryPhraseBox } from './recovery-phrase-box'
import { RecoveryPhraseConfirmation } from './recovery-phrase-confirmation'

type RecoveryPhraseDialogProps = {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
  mnemonic: string | null
}

export const RecoveryPhraseDialog = ({
  isOpen,
  onClose,
  onComplete,
  mnemonic,
}: RecoveryPhraseDialogProps) => {
  if (!mnemonic) {
    return null
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-blur-neutral-100/70 opacity-[30%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%]" />
        <Dialog.Content
          data-customisation="blue"
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100vh-32px)] w-full max-w-[448px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-20 bg-white-100 p-4 pb-0 shadow-1 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%] data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        >
          <Dialog.Close className="absolute right-3 top-3 z-40 rounded-10 border border-neutral-30 p-1.5 transition-colors active:border-neutral-50 hover:border-neutral-40 disabled:pointer-events-none">
            <span className="sr-only">Close</span>
            <CloseIcon className="text-neutral-100" />
          </Dialog.Close>

          <div className="flex flex-col gap-4">
            <Dialog.Title className="text-27 font-600">
              Backup recovery phrase
            </Dialog.Title>

            <RecoveryPhraseBox mnemonic={mnemonic} />

            <div className="flex flex-col gap-4 text-15 text-neutral-100">
              <p>
                <strong>What is a Recovery Phrase?</strong>
                <br />A 12-word phrase that gives full access to your funds and
                is the only way to recover them.
              </p>
              <p>
                <strong>How do I save my Recovery Phrase?</strong>
                <br />
                Write it down and store it securely in a safe place.
              </p>
              <p>
                <strong>Should I share my Recovery Phrase?</strong>
                <br />
                Never share your Secret Recovery Phrase. If someone asks for it,
                they&apos;re likely trying to scam you.
              </p>
            </div>

            <RecoveryPhraseConfirmation onConfirm={onComplete} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
