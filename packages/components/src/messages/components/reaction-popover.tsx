import { XStack } from 'tamagui'

import { Popover } from '../../popover'
import { ReactButton } from '../../react-button'

import type { PopoverProps } from '../../popover'
import type { ReactionsType } from '../types'

type Props = Omit<PopoverProps, 'children'> & {
  children: React.ReactElement
  reactions: ReactionsType
  onOpenChange?: PopoverProps['onOpenChange']
}

export const ReactionPopover = (props: Props) => {
  const { children, reactions, onOpenChange, ...popoverProps } = props

  return (
    <Popover {...popoverProps} onOpenChange={onOpenChange} modal={false}>
      {children}

      <Popover.Content>
        <XStack space={2} padding={2}>
          <ReactButton
            variant="ghost"
            size={32}
            icon="love"
            selected={reactions['love']?.has('me')}
          />
          <ReactButton
            variant="ghost"
            size={32}
            icon="thumbs-up"
            selected={reactions['thumbs-up']?.has('me')}
          />
          <ReactButton
            variant="ghost"
            size={32}
            icon="thumbs-down"
            selected={reactions['thumbs-down']?.has('me')}
          />
          <ReactButton
            variant="ghost"
            size={32}
            icon="laugh"
            selected={reactions.laugh?.has('me')}
          />
          <ReactButton
            variant="ghost"
            size={32}
            icon="sad"
            selected={reactions.sad?.has('me')}
          />
          <ReactButton
            variant="ghost"
            size={32}
            icon="angry"
            selected={reactions.angry?.has('me')}
          />
        </XStack>
      </Popover.Content>
    </Popover>
  )
}
