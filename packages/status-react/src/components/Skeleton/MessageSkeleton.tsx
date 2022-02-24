import React from 'react'

import styled from 'styled-components'

import { Skeleton } from './Skeleton'

import type { ReactNode } from 'react'

interface MessageSkeletonProps {
  children: ReactNode
}

export const MessageSkeleton = ({ children }: MessageSkeletonProps) => {
  return (
    <MessageWrapper>
      <AvatarSkeleton width="40px" height="40px" borderRadius="50%" />
      <ContentWrapper>
        <MessageHeaderWrapper>
          <UserNameSkeleton width="132px" />
          <TimeSkeleton width="47px" height="14px" />
        </MessageHeaderWrapper>
        <MessageBodyWrapper>{children}</MessageBodyWrapper>
      </ContentWrapper>
    </MessageWrapper>
  )
}

const MessageWrapper = styled.div`
  display: flex;
  padding: 8px 0;
  margin-bottom: 8px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const MessageHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
`

const MessageBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AvatarSkeleton = styled(Skeleton)`
  border-radius: 50%;
  margin-right: 8px;
`

const UserNameSkeleton = styled(Skeleton)`
  margin-right: 4px;
`

const TimeSkeleton = styled(Skeleton)`
  margin-right: 4px;
`
