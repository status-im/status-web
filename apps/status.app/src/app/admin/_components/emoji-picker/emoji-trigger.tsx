import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { EditIcon } from '@status-im/icons/12'
import { useTranslations } from 'next-intl'

import { type Emoji, EmojiTwitter } from './emoji-twitter'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  selectedEmoji?: Emoji
}

const EmojiTrigger = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { selectedEmoji, ...rest } = props
  const t = useTranslations('admin')

  return (
    <button {...rest} ref={ref}>
      <div className="relative text-[36px]">
        <EmojiTwitter
          char={selectedEmoji?.char || '🍿'}
          name={selectedEmoji?.name || 'popcorn'}
        />
        <div className="absolute left-[26px] top-[18px] flex size-6 items-center justify-center rounded-full bg-neutral-80/5 backdrop-blur-md">
          <EditIcon className="text-neutral-100" />
        </div>
      </div>
      <span className="sr-only">{t('openEmojiPicker')}</span>
    </button>
  )
})

EmojiTrigger.displayName = 'EmojiTrigger'

export { EmojiTrigger }
