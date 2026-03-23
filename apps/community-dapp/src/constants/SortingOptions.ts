import { DirectorySortingEnum, VotingSortingEnum } from '../models/community'

export const VotingSortingOptions = [
  { value: VotingSortingEnum.EndingSoonest, text: 'Ending Soonest' },
  { value: VotingSortingEnum.EndingLatest, text: 'Ending Latest' },
  { value: VotingSortingEnum.MostVotes, text: 'Most Votes' },
  { value: VotingSortingEnum.LeastVotes, text: 'Least Votes' },
  { value: VotingSortingEnum.AtoZ, text: 'A to Z' },
  { value: VotingSortingEnum.ZtoA, text: 'Z to A' },
]

export const DirectorySortingOptions = [
  { value: DirectorySortingEnum.IncludedRecently, text: 'Included Recently' },
  { value: DirectorySortingEnum.IncludedLongAgo, text: 'Included Long Ago' },
  { value: DirectorySortingEnum.MostVotes, text: 'Most Votes' },
  { value: DirectorySortingEnum.LeastVotes, text: 'Least Votes' },
  { value: DirectorySortingEnum.AtoZ, text: 'A to Z' },
  { value: DirectorySortingEnum.ZtoA, text: 'Z to A' },
]
