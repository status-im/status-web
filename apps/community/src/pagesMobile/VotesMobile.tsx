import React, { useState } from 'react'
import { FilterList } from '../components/Filter'
import { Search } from '../components/Input'
import { SearchEmpty } from '../components/SearchEmpty'
import { VoteFilter } from '../components/votes/VoteFilter'
import { VotingEmpty } from '../components/votes/VotingEmpty'
import { TopBarMobile } from '../componentsMobile/TopBarMobile'
import { useVotingCommunities } from '../hooks/useVotingCommunities'
import { VotingSortingEnum } from '../models/community'
import styled from 'styled-components'
import { VotingSortingOptions } from '../constants/SortingOptions'
import { VotingCardCover } from '../componentsMobile/VotingCardCover'
import { ButtonPrimary } from '../components/Button'
import { useHistory } from 'react-router'
import { ConnectionNetwork } from '../components/ConnectionNetwork'
import { VotingSkeletonMobile } from '../componentsMobile/VotingSkeletonMobile'
import { DetailedVotingRoom } from '../models/smartContract'
import { useAccount } from '../hooks/useAccount'
import { useWaku } from '../providers/waku/provider'

export function VotesMobile() {
  const { isActive } = useAccount()
  const { isConnected } = useWaku()
  const [sortedBy, setSortedBy] = useState(VotingSortingEnum.EndingSoonest)
  const [voteType, setVoteType] = useState('')
  const [filterKeyword, setFilterKeyword] = useState('')
  const { roomsToShow, empty } = useVotingCommunities(filterKeyword, voteType, sortedBy)
  const history = useHistory()

  const renderCommunities = () => {
    if (roomsToShow.length === 0) {
      return empty ? <VotingEmpty /> : <SearchEmpty />
    }

    return roomsToShow.map((room: DetailedVotingRoom, idx) => {
      if (room?.details) {
        return <VotingCardCover key={idx} room={room} />
      } else {
        return <VotingSkeletonMobile key={idx} />
      }
    })
  }

  return (
    <div>
      <TopBarMobile
        heading="Ongoing Votes"
        text="Help curate the Status Communities directory by voting which communities should be included"
        type={0}
      >
        <VoteBar>
          <PageDesktopBar>
            <Search
              type="text"
              placeholder="Search communities..."
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.currentTarget.value)}
            />
            <FilterList value={sortedBy} setValue={setSortedBy} options={VotingSortingOptions} />
          </PageDesktopBar>
          <VoteFilter voteType={voteType} setVoteType={setVoteType} />
        </VoteBar>
      </TopBarMobile>
      <VotingCardsWrapper>{renderCommunities()}</VotingCardsWrapper>

      <ProposeButtonWrapper>
        {isActive && (
          <ProposeButton onClick={() => history.push('/propose')} disabled={!isConnected}>
            Propose community
          </ProposeButton>
        )}
        <ConnectionNetwork />
      </ProposeButtonWrapper>
    </div>
  )
}

export const ProposeButtonWrapper = styled.div`
  position: fixed;
  padding: 0 16px;
  bottom: 15px;
  width: 100%;
  z-index: 100;
`

export const ProposeButton = styled(ButtonPrimary)`
  margin: auto;
  width: 100%;
  padding: 10px 0;
  text-align: center;
`

const VotingCardsWrapper = styled.div`
  padding: 307px 16px 68px;

  @media (max-width: 340px) {
    padding-top: 320px;
  }
`
const PageDesktopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  width: 100%;
`

const VoteBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px 0 16px;
  background: #fff;
  padding: 16px;
  box-shadow: 0px 6px 6px -6px rgba(0, 0, 0, 0.15);
`
