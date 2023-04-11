import { useEffect } from 'react'

import {
  AddReactionIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
  ForwardIcon,
  LinkIcon,
  OptionsIcon,
  PinIcon,
  ReplyIcon,
} from '@status-im/icons/20'

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
      space={2}
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
        <IconButton variant="ghost" icon={<AddReactionIcon />} />
      </ReactionPopover>

      {/* REPLY */}
      <IconButton variant="ghost" icon={<ReplyIcon />} onPress={onReplyPress} />

      {/* EDIT */}
      <IconButton variant="ghost" icon={<EditIcon />} onPress={onEditPress} />

      {/* DELETE */}
      {/* <IconButton
        variant="ghost"
        icon={<DeleteIcon />}
        onPress={onDeletePress}
      /> */}

      {/* OPTIONS MENU */}
      <DropdownMenu modal={false} onOpenChange={onOpenChange}>
        <IconButton variant="ghost" icon={<OptionsIcon />} />
        <DropdownMenu.Content align="end" sideOffset={10} zIndex={101}>
          <DropdownMenu.Item
            icon={<EditIcon />}
            label="Edit message"
            onSelect={onEditPress}
          />
          <DropdownMenu.Item
            icon={<ReplyIcon />}
            label="Reply"
            onSelect={onReplyPress}
          />
          <DropdownMenu.Item
            icon={<CopyIcon />}
            label="Copy text"
            onSelect={() => console.log('copy')}
          />
          {pinned ? (
            <DropdownMenu.Item
              icon={<PinIcon />}
              label="Unpin message"
              onSelect={() => console.log('unpin')}
            />
          ) : (
            <DropdownMenu.Item
              icon={<PinIcon />}
              label="Pin to the channel"
              onSelect={() => console.log('pin')}
            />
          )}
          <DropdownMenu.Item
            icon={<ForwardIcon />}
            label="Forward"
            onSelect={() => console.log('forward')}
          />
          <DropdownMenu.Item
            icon={<LinkIcon />}
            label="Share link to message"
            onSelect={() => console.log('share')}
          />

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            icon={<DeleteIcon />}
            label="Delete message"
            danger
            onSelect={() => console.log('delete')}
          />
        </DropdownMenu.Content>
      </DropdownMenu>
    </Shadow>
  )
}
