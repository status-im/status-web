import { useContractCall } from '@usedapp/core'
import { useCommunities } from './useCommunities'
import { useContracts } from './useContracts'

export function useFeaturedCommunities() {
  const { directoryContract } = useContracts()
  const [publicKeys] = useContractCall({
    abi: directoryContract.interface,
    address: directoryContract.address,
    method: 'getFeaturedCommunities',
    args: [],
  }) ?? [[]]

  const communities = useCommunities(publicKeys)

  return [communities, publicKeys] as const
}
