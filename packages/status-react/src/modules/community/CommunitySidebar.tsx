import React from 'react'

import styled from 'styled-components'

import { CommunityIdentity } from '../../components/CommunityIdentity'
import { CommunityModalName } from '../../components/Modals/CommunityModal'
import { CommunitySkeleton } from '../../components/Skeleton/CommunitySkeleton'
import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'

interface CommunityProps {
  className?: string
}

export function CommunitySidebar({ className }: CommunityProps) {
  const { communityData } = useMessengerContext()
  const { setModal } = useModal(CommunityModalName)

  if (!communityData) {
    return (
      <SkeletonWrapper>
        <CommunitySkeleton />
      </SkeletonWrapper>
    )
  }

  return (
    <>
      <button className={className} onClick={() => setModal(true)}>
        <CommunityIdentity subtitle={`${communityData.members} members`} />
      </button>
    </>
  )
}

const SkeletonWrapper = styled.div`
  margin-bottom: 16px;
`
