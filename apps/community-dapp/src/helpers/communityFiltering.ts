import { CommunityDetail, DirectorySortingEnum, VotingSortingEnum } from '../models/community'
import { DetailedVotingRoom, VotingRoom } from '../models/smartContract'

export function isTextInDetails(filterKeyword: string, details: CommunityDetail) {
  if (!details || !details.name || !details.description || !details.tags) {
    return false
  }
  return (
    details.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    details.description.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    details.tags.findIndex((item: string) => filterKeyword.toLowerCase() === item.toLowerCase()) > -1
  )
}

export function isTypeInRoom(voteType: string, room: VotingRoom) {
  if (!voteType) {
    return true
  }
  if (voteType === 'Add') {
    return room.voteType === 1
  }
  if (voteType === 'Remove') {
    return room.voteType === 0
  }
  return false
}

export function sortVotingFunction(sortedBy: VotingSortingEnum) {
  return (a: DetailedVotingRoom | undefined, b: DetailedVotingRoom | undefined) => {
    if (!a) {
      return 1
    }
    if (!b) {
      return -1
    }
    let aSum
    let bSum
    switch (sortedBy) {
      case VotingSortingEnum.AtoZ:
        return a.details.name < b.details.name ? -1 : 1
      case VotingSortingEnum.ZtoA:
        return a.details.name < b.details.name ? 1 : -1
      case VotingSortingEnum.EndingLatest:
        return a.endAt < b.endAt ? -1 : 1
      case VotingSortingEnum.EndingSoonest:
        return a.endAt < b.endAt ? 1 : -1
      case VotingSortingEnum.MostVotes:
        aSum = a.totalVotesAgainst.add(a.totalVotesFor)
        bSum = b.totalVotesAgainst.add(b.totalVotesFor)
        return aSum < bSum ? 1 : -1
      case VotingSortingEnum.LeastVotes:
        aSum = a.totalVotesAgainst.add(a.totalVotesFor)
        bSum = b.totalVotesAgainst.add(b.totalVotesFor)
        return aSum < bSum ? -1 : 1
    }
  }
}

export function sortDirectoryFunction(sortedBy: DirectorySortingEnum) {
  return (a: CommunityDetail | undefined, b: CommunityDetail | undefined) => {
    if (!a) {
      return 1
    }
    if (!b) {
      return -1
    }
    switch (sortedBy) {
      case DirectorySortingEnum.AtoZ:
        return a.name < b.name ? -1 : 1
      case DirectorySortingEnum.ZtoA:
        return a.name < b.name ? 1 : -1
      case DirectorySortingEnum.IncludedLongAgo:
        if (!a.directoryInfo) return 1
        if (!b.directoryInfo) return -1
        return a?.directoryInfo?.additionDate < b?.directoryInfo?.additionDate ? -1 : 1
      case DirectorySortingEnum.IncludedRecently:
        if (!a.directoryInfo) return -1
        if (!b.directoryInfo) return 1
        return a?.directoryInfo?.additionDate < b?.directoryInfo?.additionDate ? 1 : -1
      case DirectorySortingEnum.MostVotes:
        if (!a?.featureVotes) return 1
        if (!b?.featureVotes) return -1
        return a?.featureVotes < b?.featureVotes ? 1 : -1
      case DirectorySortingEnum.LeastVotes:
        if (!a?.featureVotes) return 1
        if (!b?.featureVotes) return -1
        return a?.featureVotes < b?.featureVotes ? -1 : 1
    }
  }
}
