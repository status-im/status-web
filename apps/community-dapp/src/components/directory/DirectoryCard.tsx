import React, { useEffect, useState } from 'react'
import { Card, CardCommunityWrap, CardVoteWrap } from '../Card'
import { CardCommunity } from '../card/CardCommunity'
import { CardFeature } from '../card/CardFeature'
import { CommunityDetail } from '../../models/community'
import { useGetCurrentVoting } from '../../hooks/useGetCurrentVoting'
import { useContractCall } from '@usedapp/core'
import { useContracts } from '../../hooks/useContracts'

export interface DirectoryCardProps {
  community: CommunityDetail
}

export function DirectoryCard({ community }: DirectoryCardProps) {
  const [customStyle, setCustomStyle] = useState(true)
  const { directoryContract } = useContracts()
  const [publicKeys] = useContractCall({
    abi: directoryContract.interface,
    address: directoryContract.address,
    method: 'getFeaturedCommunities',
    args: [],
  }) ?? [[]]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 769) {
        setCustomStyle(true)
      } else {
        setCustomStyle(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [window.innerWidth])

  const { currentVoting } = useGetCurrentVoting(community?.publicKey)

  return (
    <Card>
      <CardCommunityWrap>
        &nbsp;
        <CardCommunity
          community={community}
          showRemoveButton={true}
          currentVoting={currentVoting}
          customStyle={customStyle}
        />
      </CardCommunityWrap>
      <CardVoteWrap>
        <CardFeature community={community} featured={publicKeys.includes(community.publicKey)} />
      </CardVoteWrap>
    </Card>
  )
}
