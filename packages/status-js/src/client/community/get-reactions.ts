import { EmojiReaction } from '../../../protos/emoji-reaction'

type Reaction =
  | 'heart'
  | 'thumbs-up'
  | 'thumbs-down'
  | 'smile'
  | 'sad'
  | 'angry'

export type Reactions = {
  [key in Reaction]: {
    count: number
    me: boolean
  }
}

const REACTION_MAP: Record<EmojiReaction.Type, string> = {
  [EmojiReaction.Type.LOVE]: 'heart',
  [EmojiReaction.Type.THUMBS_UP]: 'thumbs-up',
  [EmojiReaction.Type.THUMBS_DOWN]: 'thumbs-down',
  [EmojiReaction.Type.LAUGH]: 'smile',
  [EmojiReaction.Type.SAD]: 'sad',
  [EmojiReaction.Type.ANGRY]: 'angry',
  [EmojiReaction.Type.UNKNOWN_EMOJI_REACTION_TYPE]: 'unknown',
}

export function getReactions(
  reaction: EmojiReaction,
  reactions: Reactions,
  isMe: boolean
) {
  // fixme!: type
  const type = REACTION_MAP[reaction.type] as Reaction
  const isRetracted = reaction.retracted

  const _reaction = {
    count: reactions[type].count,
    me: reactions[type].me,
  }

  if (isRetracted && _reaction.count !== 0) {
    _reaction.count -= 1
  } else {
    _reaction.count += 1
  }

  if (isMe) {
    _reaction.me = isRetracted ? false : true
  }

  return {
    ...reactions,
    [type]: _reaction,
  }
}
