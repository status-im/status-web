export type ReactionType =
  | 'love'
  | 'laugh'
  | 'thumbs-up'
  | 'thumbs-down'
  | 'sad'
  | 'angry'
  | 'add'

export type ReactionsType = {
  [key in ReactionType]?: Set<string>
}
