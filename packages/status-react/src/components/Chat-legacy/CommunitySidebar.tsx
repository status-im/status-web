import React from 'react'

import styled from 'styled-components'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'
import { CommunityIdentity } from '../CommunityIdentity'
import { CommunityModalName } from '../Modals/CommunityModal'
import { CommunitySkeleton } from '../Skeleton/CommunitySkeleton'

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
