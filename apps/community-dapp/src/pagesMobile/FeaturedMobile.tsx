import React from 'react'
import { DirectoryCard } from '../components/directory/DirectoryCard'
import { TopBarMobile } from '../componentsMobile/TopBarMobile'
import styled from 'styled-components'
import { useHistory } from 'react-router'
import { DirectorySkeletonMobile } from '../componentsMobile/DirectorySkeletonMobile'
import { useFeaturedCommunities } from '../hooks/useFeaturedCommunities'
import { Colors } from '../constants/styles'

export function FeaturedMobile() {
  const [communities, publicKeys] = useFeaturedCommunities()
  const history = useHistory()

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
      <TopBarMobile heading="Featured communities" text="Weekly Featured Communities" type={1}></TopBarMobile>
      <Voting>{renderCommunities()}</Voting>
    </div>
  )
}

const EmptyWrap = styled.div`
  position: absolute;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 96px);
  background: ${Colors.White};
  z-index: 99;

  @media (max-width: 600px) {
    height: 250px;
    top: 50vh;
    padding: 0 16px;
  }

  & > p {
    font-weight: bold;
    font-size: 64px;
    line-height: 64%;
    margin-bottom: 24px;

    @media (max-width: 600px) {
      font-size: 44px;
    }

    @media (max-width: 375px) {
      font-size: 34px;
    }
  }
`

const Voting = styled.div`
  padding: 256px 16px 16px;

  @media (max-width: 556px) {
    padding-top: 266px;
  }

  display: flex;
  flex-direction: column;
`
