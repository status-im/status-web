import React from 'react'
import styled from 'styled-components'
import { CardCommunityBlock, CardLinks } from '../card/CardCommunity'
import { LinkExternal, LinkInternal } from '../Link'
import { Skeleton } from '../skeleton/Skeleton'
import { TagsSkeletonList } from '../skeleton/TagSkeleton'
import { TextBlock } from '../skeleton/TextSkeleton'

interface CommunitySkeletonProps {
  customStyle?: boolean
}

export const CommunitySkeleton = ({ customStyle }: CommunitySkeletonProps) => {
  return (
    <CardCommunityBlock className={customStyle ? 'notModal' : ''}>
      {' '}
      <CardRow>
        <AvatarSkeleton borderRadius="50%" />
        <CardContent>
          <TitleSkeleton />
          <TextBlock />
          <TagsSkeleton tags={window.innerWidth < 375 ? 3 : 4} />
        </CardContent>
      </CardRow>
      <CardLinks className={customStyle ? 'notModal' : ''}>
        <StyledExternalLink>Visit community</StyledExternalLink>
        <StyledExternalLink>Etherscan</StyledExternalLink>
        <StyledInternalink>Voting history </StyledInternalink>
      </CardLinks>
    </CardCommunityBlock>
  )
}

const CardRow = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`

const CardContent = styled.div`
  width: 100%;
`

const AvatarSkeleton = styled(Skeleton)`
  min-width: 64px;
  min-height: 64px;
  max-width: 64px;
  max-height: 64px;
  border-radius: 50%;
  margin-right: 16px;
`

const TitleSkeleton = styled(Skeleton)`
  height: 12px;
  max-width: 50%;
  margin-bottom: 16px;
`

const TagsSkeleton = styled(TagsSkeletonList)`
  margin-top: 16px;
`

const StyledExternalLink = styled(LinkExternal)`
  color: #656565;

  &::after {
    mix-blend-mode: luminosity;
  }
`

const StyledInternalink = styled(LinkInternal)`
  color: #525252;

  @media (max-width: 600px) {
    display: none;
  }
`
