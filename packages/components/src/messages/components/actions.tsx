import { useEffect } from 'react'

import {
  AddReactionIcon,
  CopyIcon,
  EditIcon,
  ForwardIcon,
  LinkIcon,
  OptionsIcon,
  PinIcon,
  ReplyIcon,
  TrashIcon,
} from '@felicio/icons'

import { DropdownMenu } from '../../dropdown-menu'
import { IconButton } from '../../icon-button'
import { Shadow } from '../../shadow'
import { ReactionPopover } from './reaction-popover'

import type { ReactionsType } from '../types'

interface Props {
  reactions: ReactionsType
  onOpenChange: (open: boolean) => void
  onReplyPress: VoidFunction
  onEditPress: VoidFunction
  // onDeletePress: VoidFunction
  pinned?: boolean
}

export const Actions = (props: Props) => {
  const { reactions, onOpenChange, onReplyPress, onEditPress, pinned } = props

  useEffect(() => {
    return () => onOpenChange(false)
  }, [onOpenChange])

  return (
    <Shadow
      variant="$1"
      overflow="hidden"
      position="absolute"
      top={-8}
      right={8}
      borderRadius="$12"
      borderWidth={1}
      borderColor="$neutral-10"
      backgroundColor="$white-100"
      padding={2}
      gap={2}
      flexDirection="row"
      zIndex={10}
    >
      {/* REACTION */}
      <ReactionPopover
        reactions={reactions}
        side="left"
        sideOffset={6}
        onOpenChange={onOpenChange}
      >
        <IconButton variant="ghost" icon={<AddReactionIcon size={20} />} />
      </ReactionPopover>

      {/* REPLY */}
      <IconButton
        variant="ghost"
        icon={<ReplyIcon size={20} />}
        onPress={onReplyPress}
      />

      {/* EDIT */}
      <IconButton
        variant="ghost"
        icon={<EditIcon size={20} />}
        onPress={onEditPress}
      />

      {/* DELETE */}
      {/* <IconButton
        variant="ghost"
        icon={<TrashIcon size={20} />}
        onPress={onDeletePress}
      /> */}

      {/* OPTIONS MENU */}
      <DropdownMenu modal={false} onOpenChange={onOpenChange}>
        <IconButton variant="ghost" icon={<OptionsIcon size={20} />} />
        <DropdownMenu.Content align="end" sideOffset={10} zIndex={101}>
          <DropdownMenu.Item
            icon={<EditIcon size={20} />}
            label="Edit message"
            onSelect={onEditPress}
          />
          <DropdownMenu.Item
            icon={<ReplyIcon size={20} />}
            label="Reply"
            onSelect={onReplyPress}
          />
          <DropdownMenu.Item
            icon={<CopyIcon size={20} />}
            label="Copy text"
            onSelect={() => console.log('copy')}
          />
          {pinned ? (
            <DropdownMenu.Item
              icon={<PinIcon size={20} />}
              label="Unpin message"
              onSelect={() => console.log('unpin')}
            />
          ) : (
            <DropdownMenu.Item
              icon={<PinIcon size={20} />}
              label="Pin to the channel"
              onSelect={() => console.log('pin')}
            />
          )}
          <DropdownMenu.Item
            icon={<ForwardIcon size={20} />}
            label="Forward"
            onSelect={() => console.log('forward')}
          />
          <DropdownMenu.Item
            icon={<LinkIcon size={20} />}
            label="Share link to message"
            onSelect={() => console.log('share')}
          />

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            icon={<TrashIcon size={20} />}
            label="Delete for me"
            danger
            onSelect={() => console.log('delete for me')}
          />

          <DropdownMenu.Item
            icon={<TrashIcon size={20} />}
            label="Delete for everyone"
            danger
            onSelect={() => console.log('delete for everyone')}
          />
        </DropdownMenu.Content>
      </DropdownMenu>
    </Shadow>
  )
}
