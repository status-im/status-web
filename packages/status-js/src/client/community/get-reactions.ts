import type { EmojiReaction } from '../../../protos/emoji-reaction'

type Reaction = Exclude<`${EmojiReaction.Type}`, 'UNKNOWN_EMOJI_REACTION_TYPE'>

export type Reactions = {
  [key in Reaction]: {
    count: number
    me: boolean
  }
}

export function getReactions(
  reaction: EmojiReaction,
  reactions: Reactions,
  isMe: boolean
) {
  const { type, retracted } = reaction

  if (type === 'UNKNOWN_EMOJI_REACTION_TYPE') {
    return reactions
  }

  const _reaction = {
    count: reactions[type].count,
    me: reactions[type].me,
  }

  if (retracted && _reaction.count !== 0) {
    _reaction.count -= 1
  } else {
    _reaction.count += 1
  }

  if (isMe) {
    _reaction.me = retracted ? false : true
  }

  return {
    ...reactions,
    [type]: _reaction,
  }
}
