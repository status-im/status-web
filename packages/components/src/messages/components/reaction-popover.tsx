import {
  AngryIcon,
  LaughIcon,
  LoveIcon,
  SadIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@status-im/icons/reactions'
import { XStack } from 'tamagui'

import { IconButton } from '../../icon-button'
import { Popover } from '../../popover'

import type { PopoverProps } from '../../popover'
import type { ReactionsType } from '../types'

type Props = Omit<PopoverProps, 'children'> & {
  children: React.ReactElement
  reactions: ReactionsType
  onOpenChange?: PopoverProps['onOpenChange']
}

export const REACTIONS_ICONS = {
  love: <LoveIcon />,
  laugh: <LaughIcon />,
  'thumbs-up': <ThumbsUpIcon />,
  'thumbs-down': <ThumbsDownIcon />,
  sad: <SadIcon />,
  angry: <AngryIcon />,
} as const

export const ReactionPopover = (props: Props) => {
  const { children, reactions, onOpenChange, ...popoverProps } = props

  return (
    <Popover {...popoverProps} onOpenChange={onOpenChange} modal={false}>
      {children}

      <Popover.Content>
        <XStack space={2} padding={2}>
          <IconButton
            icon={REACTIONS_ICONS['love']}
            variant="ghost"
            selected={reactions['love']?.has('me')}
          />
          <IconButton
            icon={REACTIONS_ICONS['thumbs-up']}
            variant="ghost"
            selected={reactions['thumbs-up']?.has('me')}
          />
          <IconButton
            icon={REACTIONS_ICONS['thumbs-down']}
            variant="ghost"
            selected={reactions['thumbs-down']?.has('me')}
          />
          <IconButton
            icon={REACTIONS_ICONS['laugh']}
            variant="ghost"
            selected={reactions.laugh?.has('me')}
          />
          <IconButton
            icon={REACTIONS_ICONS['sad']}
            variant="ghost"
            selected={reactions.sad?.has('me')}
          />
          <IconButton
            icon={REACTIONS_ICONS['angry']}
            variant="ghost"
            selected={reactions.angry?.has('me')}
          />
        </XStack>
      </Popover.Content>
    </Popover>
  )
}
