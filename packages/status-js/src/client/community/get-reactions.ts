import type { EmojiReaction } from '../../../protos/emoji-reaction'

type Reaction = Exclude<`${EmojiReaction.Type}`, 'UNKNOWN_EMOJI_REACTION_TYPE'>

export type Reactions = {
  [key in Reaction]: Set<string>
}

export function getReactions(
  reaction: EmojiReaction,
  reactions: Reactions,
  publicKey: string
): Reactions {
  const { type, retracted } = reaction

  if (type === 'UNKNOWN_EMOJI_REACTION_TYPE') {
    return reactions
  }

  if (retracted) {
    reactions[type].delete(publicKey)
  } else {
    // Set handles that potentially multiple same reactions count as one
    reactions[type].add(publicKey)
  }

  return reactions
}
