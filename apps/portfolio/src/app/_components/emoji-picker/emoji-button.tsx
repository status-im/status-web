import { EmojiTwitter } from './emoji-twitter'

import type { Emoji } from './emoji-twitter'

type Props = {
  emoji: Emoji
  onSelect: (emoji: Emoji) => void
}

const EmojiButton = (props: Props) => {
  const { emoji, onSelect } = props
  return (
    <button
      aria-label={emoji.name}
      className="flex size-8 items-center justify-center rounded-8 text-[24px] transition-colors hover:bg-neutral-10 [&>img]:!m-0 [&>img]:!h-6 [&>img]:!w-6"
      onClick={onSelect.bind(null, emoji)}
    >
      <EmojiTwitter {...emoji} />
    </button>
  )
}

export { EmojiButton }
