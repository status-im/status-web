import React from 'react'

import { ReactionPopover } from '../../../../components/reaction-popover'
import { PencilIcon } from '../../../../icons/pencil-icon'
// import { PinIcon } from '../../../../icons/pin-icon'
import { ReactionIcon } from '../../../../icons/reaction-icon'
import { ReplyIcon } from '../../../../icons/reply-icon'
import { TrashIcon } from '../../../../icons/trash-icon'
// import { UnpinIcon } from '../../../../icons/unpin-icon'
import { styled } from '../../../../styles/config'
import {
  AlertDialog,
  AlertDialogTrigger,
  IconButton,
  Tooltip,
} from '../../../../system'

import type { Reaction, Reactions } from '../../../../protocol'

interface Props {
  owner: boolean
  pinned: boolean
  onReplyClick: () => void
  onEditClick: () => void
  onPinClick: () => void
  onDeleteClick: () => void
  onReactionClick: (reaction: Reaction) => void
  reacting: boolean
  onReactingChange: (reacting: boolean) => void
  reactions: Reactions
}

export const Actions = (props: Props) => {
  const {
    owner,
    onReplyClick,
    onEditClick,
    onDeleteClick,
    // pinned,
    // onPinClick,
    reacting,
    onReactionClick,
    onReactingChange,
    reactions,
  } = props

  return (
    <Wrapper open={reacting}>
      <ReactionPopover
        reactions={reactions}
        open={reacting}
        onOpenChange={onReactingChange}
        onClick={emoji => {
          onReactionClick(emoji)
          onReactingChange(false)
        }}
      >
        <Tooltip label="React">
          <IconButton label="Pick reaction" intent="info" color="gray">
            <ReactionIcon />
          </IconButton>
        </Tooltip>
      </ReactionPopover>
      <Tooltip label="Reply">
        <IconButton
          label="Reply to message"
          intent="info"
          color="gray"
          onClick={onReplyClick}
        >
          <ReplyIcon />
        </IconButton>
      </Tooltip>
      {owner && (
        <Tooltip label="Edit">
          <IconButton
            label="Edit message"
            intent="info"
            color="gray"
            onClick={onEditClick}
          >
            <PencilIcon />
          </IconButton>
        </Tooltip>
      )}
      {/* <Tooltip label={pinned ? 'Unpin' : 'Pin'}>
        <IconButton
          label={pinned ? 'Unpin message' : 'Pin message'}
          intent="info"
          color="gray"
          onClick={onPinClick}
        >
          {pinned ? <UnpinIcon /> : <PinIcon />}
        </IconButton>
      </Tooltip> */}
      {owner && (
        <AlertDialogTrigger>
          <Tooltip label="Delete">
            <IconButton label="Delete message" intent="danger" color="gray">
              <TrashIcon />
            </IconButton>
          </Tooltip>
          <AlertDialog
            title="Delete Message"
            description="Are you sure you want to delete this message?"
            actionLabel="Delete"
            actionVariant="danger"
            onAction={onDeleteClick}
            cancelLabel="Cancel"
          />
        </AlertDialogTrigger>
      )}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  position: 'absolute',
  top: -18,
  right: 16,
  padding: 2,
  boxShadow: '0px 4px 12px rgba(0, 34, 51, 0.08)',
  background: '$background',
  borderRadius: 8,
  display: 'none',

  ':hover > &': {
    display: 'flex',
  },

  variants: {
    open: {
      true: {
        display: 'flex',
      },
    },
  },
})
