import { useEffect } from 'react'
import { CommunityDetail } from '../models/community'
import { useCommunities } from './useCommunities'

export function useCommunityDetails(publicKey: string, setCommunityDetail: (val: CommunityDetail | undefined) => void) {
  const [CommunityDetail] = useCommunities(publicKey ? [publicKey] : [])

  useEffect(() => {
    setCommunityDetail(CommunityDetail)
  }, [JSON.stringify(CommunityDetail)])

  return !CommunityDetail
}
