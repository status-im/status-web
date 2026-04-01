import React from 'react'
import styled from 'styled-components'
import { CardCommunityWrap, CardVoteWrap } from '../components/Card'
import { CardCommunity } from '../components/card/CardCommunity'
import { Colors } from '../constants/styles'
import { DetailedVotingRoom } from '../models/smartContract'
import { CardVoteMobile } from './CardVoteMobile'
import { ConnectMobile } from './ConnectMobile'
import { HeaderWrapperMobile } from './TopBarMobile'

export interface VotingMobileProps {
  room: DetailedVotingRoom
}

export const VotingMobile = ({ room }: VotingMobileProps) => {
  return (
    <TopVoting>
      <HeaderVotingMobile>
        <ConnectMobile />
        <CardCommunityWrap style={{ padding: '0 16px' }}>
          {' '}
          <CardCommunity community={room.details} />
        </CardCommunityWrap>
      </HeaderVotingMobile>
      <CardVoteWrap style={{ padding: '16px' }}>
        {' '}
        <CardVoteMobile room={room} />
      </CardVoteWrap>
    </TopVoting>
  )
}

const TopVoting = styled.div`
  height: 100%;
`
export const HeaderVotingMobile = styled(HeaderWrapperMobile)`
  background-color: ${Colors.GrayLight};
  padding-bottom: 12px;
`
