'use client'

import { useState } from 'react'

import { Button, Checkbox } from '@status-im/components'

type Props = {
  onConfirm: () => void
}

function RecoveryPhraseConfirmation({ onConfirm }: Props) {
  const [isChecked, setIsChecked] = useState(false)

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <div className="sticky bottom-0 mt-auto flex flex-col gap-4 border-t border-neutral-10 bg-white-100 py-4">
      <div className="flex items-center gap-2 text-15 text-neutral-100">
        <label
          htmlFor="recovery-phrase-backed"
          className="flex cursor-pointer select-none items-start gap-2 text-15"
        >
          <div className="mt-[3px]">
            <Checkbox
              id="recovery-phrase-backed"
              checked={isChecked}
              onCheckedChange={() => setIsChecked(!isChecked)}
            />
          </div>
          I've backed up my recovery phrase and understand that clicking “Finish
          Backup” will remove it from this wallet interface.
        </label>
      </div>
      <Button variant="primary" disabled={!isChecked} onClick={handleConfirm}>
        Finish backup
      </Button>
    </div>
  )
}

export { RecoveryPhraseConfirmation }
