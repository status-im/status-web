import { Button } from '@status-im/components'
import { CloseIcon, PinIcon, PuzzleIcon } from '@status-im/icons/16'
import { cx } from 'class-variance-authority'

import { Logo } from '../logo'

type Props = {
  onClose: () => void
}

export const PinExtension = ({ onClose }: Props) => {
  return (
    <div className="flex flex-col gap-2 rounded-16 bg-white-100 px-3 py-[10px] shadow-2">
      <div className="absolute right-3 top-[10px]">
        <Button
          size="24"
          onPress={onClose}
          variant="ghost"
          icon={<CloseIcon />}
          aria-label="Close"
        />
      </div>
      <Logo />
      <div>
        <h2 className="text-15 font-600">Pin the Status extension</h2>
        <div className="flex items-center gap-2">
          Click <FakeIconButton icon={<PuzzleIcon />} /> then
          <FakeIconButton icon={<PinIcon />} />
        </div>
      </div>
    </div>
  )
}

const FakeIconButton = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <div
      className={cx(
        'inline-flex shrink-0 select-none items-center justify-center gap-1 text-center font-medium outline-none transition-all',
        'size-[24px] rounded-8 px-2 text-13',
        'bg-neutral-10 text-neutral-100 dark:bg-neutral-80 dark:text-white-100',
      )}
    >
      <span className="shrink-0 [&>svg]:size-full">{icon}</span>
    </div>
  )
}
