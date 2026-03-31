import React from 'react'
import styled from 'styled-components'
import { Card, CardCommunityWrap, CardVoteBlock, CardVoteWrap } from '../Card'
import { CommunitySkeleton } from '../skeleton/CommunitySkeleton'
import { Skeleton } from '../skeleton/Skeleton'

export const VotingCardSkeleton = () => {
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
          <Row>
            <div>
              <span>❓</span>
              <Skeleton width="90px" height="16px" />
            </div>
            <div>
              <RowCenter width="43px" height="8px" />
            </div>
            <div>
              <span>❓</span>
              <Skeleton width="90px" height="16px" />
            </div>
          </Row>
          <ProgressSkeleton />
          <ButtonsRow>
            <SkeletonButton />
            <SkeletonButton />
          </ButtonsRow>
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
    display: none;
  }
`

const ProgressSkeleton = styled(Skeleton)`
  height: 16px;
  margin: 12px 0 32px;

  @media (max-width: 768px) {
    width: 400px;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
`

const ButtonsRow = styled.div`
  display: flex;

  @media (max-width: 768px) {
    margin-top: 32px;
  }
`

const SkeletonButton = styled(Skeleton)`
  height: 44px;

  & + & {
    margin-left: 46px;
  }
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    span {
      width: 24px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      mix-blend-mode: luminosity;
    }
  }
`
const RowCenter = styled(Skeleton)`
  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`
