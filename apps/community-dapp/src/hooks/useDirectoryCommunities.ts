import { useContractCall } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { isTextInDetails, sortDirectoryFunction } from '../helpers/communityFiltering'
import { CommunityDetail, DirectorySortingEnum } from '../models/community'
import { useCommunities } from './useCommunities'
import { useContracts } from './useContracts'

export function useDirectoryCommunities(filterKeyword: string, sortedBy: DirectorySortingEnum) {
  const { directoryContract } = useContracts()
  const [publicKeys] = useContractCall({
    abi: directoryContract.interface,
    address: directoryContract.address,
    method: 'getCommunities',
    args: [],
  }) ?? [[]]

  const unfilteredComm = useCommunities(publicKeys)
  const [filteredCommunities, setFilteredCommunities] = useState<(CommunityDetail | undefined)[]>([])

  useEffect(() => {
    const filterCommunities = unfilteredComm.filter((comm: CommunityDetail | undefined) => {
      if (comm) {
        return isTextInDetails(filterKeyword, comm)
      }
      return true
    })
    setFilteredCommunities(filterCommunities.sort(sortDirectoryFunction(sortedBy)))
  }, [JSON.stringify(unfilteredComm), sortedBy, filterKeyword])

  return [filteredCommunities, publicKeys] as const
}
