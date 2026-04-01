import { useMemo, useState } from 'react'
import { useCommunitiesProvider } from '../providers/communities/provider'
import { CommunityDetail } from '../models/community'
import { useEffect } from 'react'
import { useContractCalls } from '@usedapp/core'
import { useContracts } from './useContracts'
import { useWaku } from '../providers/waku/provider'
import { deserializePublicKey, serializePublicKey } from '@status-im/js'
import { BigNumber } from 'ethers'
import { useFeaturedVotes } from '../providers/featuredVotes/provider'
import { getRequestClient } from '../lib/request-client'

export function useCommunities(publicKeys: string[]): CommunityDetail[] {
  const { communitiesDetails, dispatch } = useCommunitiesProvider()
  const { waku } = useWaku()
  const { votes } = useFeaturedVotes()
  const [processedKeys, setProcessedKeys] = useState<Set<string>>(new Set())

  const { votingContract } = useContracts()

  const votingHistories =
    useContractCalls(
      publicKeys.map((publicKey) => {
        return {
          abi: votingContract.interface,
          address: votingContract.address,
          method: 'getVotingHistory',
          args: [publicKey],
        }
      }),
    ) ?? []

  useEffect(() => {
    setProcessedKeys(new Set())

    if (!waku || publicKeys.length === 0) {
      return
    }

    const fetch = async () => {
      const newProcessedKeys = new Set<string>()

      for (const publicKey of publicKeys) {
        try {
          const deserializedPublicKey = deserializePublicKey(publicKey)

          if (communitiesDetails[deserializedPublicKey]) {
            newProcessedKeys.add(publicKey)
            continue
          }

          const requestClient = getRequestClient(waku)
          const community = await requestClient.fetchCommunityDescription(deserializedPublicKey)

          if (!community) {
            console.warn(`Community ${deserializedPublicKey} not found`)
            newProcessedKeys.add(publicKey)
            continue
          }

          dispatch({
            publicKey: deserializedPublicKey,
            name: community!.identity!.displayName,
            description: community!.identity!.description,
            ens: community!.identity!.ensName,
            icon: community!.identity!.images.large
              ? URL.createObjectURL(
                  new Blob([new Uint8Array(community!.identity!.images.large.payload)], {
                    type: 'image/jpeg',
                  }),
                )
              : null,
            link: `https://status.app/c#${serializePublicKey(publicKey)}`,
            currentVoting: undefined,
            tags: community.tags,
            numberOfMembers: Object.keys(community.members).length,
            votingHistory: [],
            validForAddition: true,
          })
          newProcessedKeys.add(publicKey)
        } catch (error) {
          console.error('Error fetching community', error)
          newProcessedKeys.add(publicKey)
        }
      }

      setProcessedKeys(newProcessedKeys)
    }

    fetch()
  }, [waku, JSON.stringify(publicKeys), JSON.stringify(communitiesDetails)])

  const allProcessed = publicKeys.length > 0 && publicKeys.every((key) => processedKeys.has(key))

  const communities = useMemo(() => {
    if (!allProcessed) {
      return []
    }

    return publicKeys
      .map((publicKey, index) => {
        const deserializedPublicKey = deserializePublicKey(publicKey)
        if (!communitiesDetails[deserializedPublicKey]) {
          return
        }

        const votingRooms = votingHistories[index]?.[0]

        const votingHistory =
          votingRooms?.map((room: any) => {
            const endAt = new Date(room.endAt.toNumber() * 1000)
            return {
              ID: room.roomNumber.toNumber(),
              type: room.voteType === 1 ? 'Add' : 'Remove',
              result:
                endAt > new Date() ? 'Ongoing' : room.totalVotesFor.gt(room.totalVotesAgainst) ? 'Passed' : 'Failed',
              date: endAt,
            } as const
          }) ?? []

        return {
          ...communitiesDetails[deserializedPublicKey],
          votingHistory,
          featureVotes: votes?.[publicKey]?.sum ?? BigNumber.from(0),
        }
      })
      .filter(Boolean)
  }, [publicKeys, votingHistories, communitiesDetails, votes, allProcessed])

  // TypeScript doesn't know that the filter above removes undefined values
  return communities as CommunityDetail[]
}
