import React from 'react'
import styled from 'styled-components'
import { Card, CardCommunityWrap, CardVoteBlock, CardVoteWrap } from '../components/Card'
import { CommunitySkeleton } from '../components/skeleton/CommunitySkeleton'
import { Skeleton } from '../components/skeleton/Skeleton'

export const DirectorySkeletonMobile = () => {
  return (
    <Card>
      <CardCommunityWrap>
        <CommunitySkeleton customStyle={true} />
      </CardCommunityWrap>
      <CardVoteWrap>
        <CardVoteBlock>
          <Row>
            <span>⭐️</span>
            <Skeleton width="70%" height="12px" />
          </Row>
        </CardVoteBlock>
      </CardVoteWrap>
    </Card>
  )
}

const Row = styled.div`
  display: flex;
  justify-content: center;

  & > span {
    margin-right: 6px;
    mix-blend-mode: luminosity;
  }
`
