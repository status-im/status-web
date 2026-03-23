import React from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { CardCommunity } from '../components/card/CardCommunity'
import { RemoveAmountPicker } from '../components/card/RemoveAmountPicker'
import { CommunitySkeleton } from '../components/skeleton/CommunitySkeleton'
import { MobileBlock, MobileHeading, MobileTop, MobileWrap } from '../constants/styles'
import { useCommunities } from '../hooks/useCommunities'
import { ConnectMobile } from './ConnectMobile'
import { HeaderVotingMobile } from './VotingMobile'

export function RemoveMobile() {
  const { publicKey } = useParams<{ publicKey: string }>()

  const [community] = useCommunities([publicKey])

  if (!community) {
    return <CommunitySkeleton />
  }

  return (
    <MobileWrap>
      <HeaderVotingMobile>
        <ConnectMobile />
        <MobileTop>
          <CardCommunity community={community} />
        </MobileTop>
      </HeaderVotingMobile>
      <MobileBlock>
        <RemoveHeading>{`Remove ${community.name}?`}</RemoveHeading>

        <RemoveAmountPicker
          community={community}
          setShowConfirmModal={(val: boolean) => {
            val
          }}
        />
      </MobileBlock>
    </MobileWrap>
  )
}

const RemoveHeading = styled(MobileHeading)`
  margin-bottom: 16px;
`
