import { forwardRef } from 'react'

import { Avatar } from '@status-im/components'
import { EditIcon } from '@status-im/icons/20'

type EmojiTriggerProps = {
  field: { name: string; value: string }
}

const AccountEmojiTrigger = forwardRef<HTMLButtonElement, EmojiTriggerProps>(
  (props, ref) => {
    const { field, ...rest } = props

    return (
      <button className="relative size-fit" {...rest} ref={ref}>
        <Avatar
          type="account"
          size="80"
          name={field.name}
          emoji={field.value}
          bgOpacity="10"
        />
        <div className="absolute bottom-0 right-[-8px] flex size-8 items-center justify-center rounded-full bg-neutral-80/5 backdrop-blur-md">
          <EditIcon color="$neutral-100" />
        </div>
      </button>
    )
  }
)

AccountEmojiTrigger.displayName = 'AccountEmojiTrigger'

export { AccountEmojiTrigger }
