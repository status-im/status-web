import { CommunityDetail } from './community'

export type APIOptions = {
  numberPerPage: number
  voteType?: string
  sortedBy?: number
  filterKeyword?: string
}

export type APIFunction = (
  pageNumber: number,
  options: APIOptions,
) => Promise<{ page: number; communities: CommunityDetail[] }>
