export type VoteType = {
  type: 0 | 1
  icon: string
  text: string
  verb: string
  noun: string
}

type Vote = {
  [type: string]: {
    question: string
    for: VoteType
    against: VoteType
  }
}

export const voteTypes: Vote = {
  Add: {
    question: 'Add to directory?',
    for: {
      type: 1,
      icon: '👍',
      text: 'Add',
      verb: 'to add',
      noun: '',
    },
    against: {
      type: 0,
      icon: '👎',
      text: "Don't add",
      verb: 'not to add',
      noun: '',
    },
  },

  Remove: {
    question: 'Remove from directory?',
    for: {
      type: 1,
      icon: '🗑',
      text: 'Remove',
      verb: 'to remove',
      noun: 'removal',
    },
    against: {
      type: 0,
      icon: '📌',
      text: 'Keep',
      verb: 'to keep',
      noun: 'inclusion',
    },
  },
}
