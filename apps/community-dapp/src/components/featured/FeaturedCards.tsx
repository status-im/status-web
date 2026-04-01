import React from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants/styles'
import { useFeaturedCommunities } from '../../hooks/useFeaturedCommunities'
import { DirectoryCard } from '../directory/DirectoryCard'
import { DirectoryCardSkeleton } from '../directory/DirectoryCardSkeleton'

export function FeaturedCards() {
  const [communities, publicKeys] = useFeaturedCommunities()

  const renderCommunities = () => {
    if (!publicKeys) {
      return null
    }

    if (publicKeys.length === 0) {
      return (
        <EmptyWrap>
          <span>No communities were featured last week.</span>
        </EmptyWrap>
      )
    }

    if (communities.length === 0) {
      return publicKeys.map((publicKey: string) => {
        return <DirectoryCardSkeleton key={publicKey} />
      })
    }

    return communities.map((community) => <DirectoryCard key={community!.publicKey} community={community!} />)
  }

  return (
    <>
      <Voting>{renderCommunities()}</Voting>
    </>
  )
}

const Voting = styled.div`
  display: flex;
  flex-direction: column;
`

export const EmptyWrap = styled.div`
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 90px;
  background: ${Colors.White};
  font-size: 22px;
  line-height: 38px;
  z-index: 99;

  & > p {
    font-weight: bold;
    font-size: 64px;
    line-height: 64%;
    margin-bottom: 24px;
  }
`
