import React from 'react'
import styled from 'styled-components'
import { ColumnFlexDiv } from '../../constants/styles'
import { Card, CardCommunityWrap, CardVoteBlock, CardVoteWrap } from '../Card'
import { CommunitySkeleton } from '../skeleton/CommunitySkeleton'
import { Skeleton } from '../skeleton/Skeleton'

export const DirectoryCardSkeleton = () => {
  return (
    <Card>
      <CardCommunityWrap>
        <CommunitySkeleton customStyle={true} />
      </CardCommunityWrap>
      <CardVoteWrap>
        <CardVoteBlock>
          <CardHeader>
            <Skeleton width="50%" />
          </CardHeader>
          <Column>
            <span>⭐️</span>
            <Skeleton width="200px" height="22px" />
          </Column>
          <SkeletonButton />
        </CardVoteBlock>
      </CardVoteWrap>
    </Card>
  )
}

const CardHeader = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 54px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`

const SkeletonButton = styled(Skeleton)`
  height: 44px;
`

const Column = styled(ColumnFlexDiv)`
  justify-content: space-between;
  height: 60px;
  margin-bottom: 32px;

  span {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    mix-blend-mode: luminosity;
  }

  @media (max-width: 768px) {
    display: none;
  }
`
