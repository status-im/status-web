import React, { useEffect, useState } from 'react'
import { DirectoryCard } from '../components/directory/DirectoryCard'
import { TopBarMobile } from '../componentsMobile/TopBarMobile'
import { useDirectoryCommunities } from '../hooks/useDirectoryCommunities'
import { DirectorySortingEnum } from '../models/community'
import styled from 'styled-components'
import { Search } from '../components/Input'
import { DirectorySortingOptions } from '../constants/SortingOptions'
import { SearchEmpty } from '../components/SearchEmpty'
import { WeeklyFeature } from '../components/WeeklyFeature'
import { FilterList } from '../components/Filter'
import { useHistory } from 'react-router'
import { DirectorySkeletonMobile } from '../componentsMobile/DirectorySkeletonMobile'
import { useContractFunction } from '@usedapp/core'
import { useContracts } from '../hooks/useContracts'
import { useFeaturedVotes } from '../providers/featuredVotes/provider'
import { useFeaturedVotingState } from '../hooks/useFeaturedVotingState'
import { config } from '../config'
import { ConnectionNetwork } from '../components/ConnectionNetwork'
import { ProposeButton } from './VotesMobile'
import { useFeaturedBatches } from '../hooks/useFeaturedBatches'
import { mapFeaturesVotes, receiveWakuFeature } from '../helpers/receiveWakuFeature'
import { useTypedFeatureVote } from '../hooks/useTypedFeatureVote'
import { useWaku } from '../providers/waku/provider'
import { useAccount } from '../hooks/useAccount'

export function DirectoryMobile() {
  const { isActive } = useAccount()
  const { featuredVotingContract } = useContracts()
  const { getTypedFeatureVote } = useTypedFeatureVote()
  const { waku } = useWaku()

  const { activeVoting } = useFeaturedVotes()
  const featuredVotingState = useFeaturedVotingState(activeVoting)
  const castVotes = useContractFunction(featuredVotingContract, 'castVotes')
  const finalizeVoting = useContractFunction(featuredVotingContract, 'finalizeVoting')

  const [filterKeyword, setFilterKeyword] = useState('')
  const [sortedBy, setSortedBy] = useState(DirectorySortingEnum.IncludedRecently)
  const [communities, publicKeys] = useDirectoryCommunities(filterKeyword, sortedBy)
  const history = useHistory()

  const { finalizeVotingLimit, batchCount, batchDoneCount, beingEvaluated, beingFinalized } = useFeaturedBatches()

  useEffect(() => {
    if (finalizeVoting.state.status === 'Success' || castVotes.state.status === 'Success') {
      history.go(0)
    }
  }, [finalizeVoting.state.status, castVotes.state.status])

  const renderCommunities = () => {
    if (!publicKeys) {
      return null
    }

    if (publicKeys.length === 0) {
      return <SearchEmpty />
    }

    if (communities.length === 0) {
      return publicKeys.map((publicKey: string) => {
        return <DirectorySkeletonMobile key={publicKey} />
      })
    }

    return communities.map((community) => (
      <div key={community!.publicKey} onClick={() => history.push(`/feature/${community!.publicKey}`)}>
        <DirectoryCard community={community!} />
      </div>
    ))
  }

  return (
    <div>
      <TopBarMobile
        heading="Current directory"
        text="Vote on your favourite communities being included in
       Weekly Featured Communities"
        type={1}
      >
        <PageBar>
          <Search
            type="text"
            placeholder="Search communities..."
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.currentTarget.value)}
          />
          <FilterList value={sortedBy} setValue={setSortedBy} options={DirectorySortingOptions} />
        </PageBar>
      </TopBarMobile>
      <Voting>
        <WeeklyFeature />
        {renderCommunities()}
        <>
          <ConnectionNetwork />
          {isActive && featuredVotingState === 'verification' && (
            <ProposeButton
              onClick={async () => {
                const { votesToSend } = await receiveWakuFeature(
                  waku,
                  config.wakuConfig.wakuFeatureTopic,
                  activeVoting!,
                )
                const votes = mapFeaturesVotes(votesToSend, getTypedFeatureVote)

                const batchedVotes = votes.slice(
                  batchDoneCount * config.votesLimit,
                  batchDoneCount * config.votesLimit + finalizeVotingLimit,
                )

                await castVotes.send(batchedVotes)
              }}
            >
              Verify Weekly featured{' '}
              {batchCount > 1 && (
                <>
                  ({beingEvaluated ? batchDoneCount : 0}/{batchCount})
                </>
              )}
            </ProposeButton>
          )}
          {isActive && featuredVotingState === 'ended' && (
            <ProposeButton
              onClick={() => {
                finalizeVoting.send(finalizeVotingLimit < 1 ? 1 : finalizeVotingLimit)
              }}
            >
              Finalize Weekly featured{' '}
              {batchCount > 1 && (
                <>
                  ({beingFinalized ? batchDoneCount : 0}/{batchCount})
                </>
              )}
            </ProposeButton>
          )}
        </>
      </Voting>
    </div>
  )
}

const Voting = styled.div`
  padding: 256px 16px 16px;

  @media (max-width: 556px) {
    padding-top: 266px;
  }

  display: flex;
  flex-direction: column;
`

const PageBar = styled.div`
  justify-content: space-between;
  align-items: center;
  display: flex;
  width: 100%;
  padding: 24px 0 16px;
  background: #fff;
  padding: 16px;
  box-shadow: 0px 6px 6px -6px rgba(0, 0, 0, 0.15);
`
