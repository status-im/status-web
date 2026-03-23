import React from 'react'
import styled from 'styled-components'
import { Card, CardCommunityWrap, CardVoteBlock, CardVoteWrap } from '../components/Card'
import { CommunitySkeleton } from '../components/skeleton/CommunitySkeleton'
import { Skeleton } from '../components/skeleton/Skeleton'
import { Row } from '../components/votes/VotingCardSkeleton'

export const VotingSkeletonMobile = () => {
  return (
    <Card>
      <CardCommunityWrap>
        <CommunitySkeleton customStyle={true} />
      </CardCommunityWrap>

      <CardVoteWrap>
        <CardVoteBlock>
          <Row>
            <div>
              <span>❓</span>
              <Skeleton width="80px" height="12px" />
            </div>
            <RowCenterDiv>
              <ProgressSkeleton />
              <RowCenter width="43px" height="8px" />
            </RowCenterDiv>
            <div>
              <span>❓</span>
              <Skeleton width="80px" height="12px" />
            </div>
          </Row>
        </CardVoteBlock>
      </CardVoteWrap>
    </Card>
  )
}

const ProgressSkeleton = styled(Skeleton)`
  width: 70%;
  height: 16px;
  position: static;
  margin-top: 16px;
`

const RowCenterDiv = styled.div`
  flex: 1;
`
const RowCenter = styled(Skeleton)`
  margin-top: 8px;
`
