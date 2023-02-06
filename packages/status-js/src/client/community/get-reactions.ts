import { EmojiReaction_Type } from '../../protos/emoji-reaction_pb'

import type { EmojiReaction } from '../../protos/emoji-reaction_pb'

export type Reaction = Exclude<
  keyof typeof EmojiReaction_Type,
  'UNKNOWN_EMOJI_REACTION_TYPE'
>

export type Reactions = {
  [key in Reaction]: Set<string>
}

export function getReactions(
  reaction: EmojiReaction,
  reactions: Reactions,
  publicKey: string
): Reactions {
  const { type, retracted } = reaction

  if (type === EmojiReaction_Type.UNKNOWN_EMOJI_REACTION_TYPE) {
    return reactions
  }

  const reactionName = EmojiReaction_Type[type] as Reaction

  if (retracted) {
    reactions[reactionName].delete(publicKey)
  } else {
    // Set handles that potentially multiple same reactions count as one
    reactions[reactionName].add(publicKey)
  }

  return reactions
}
