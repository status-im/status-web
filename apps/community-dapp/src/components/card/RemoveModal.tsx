import React from 'react'
import { ColumnFlexDiv } from '../../constants/styles'
import { CommunityDetail } from '../../models/community'
import { CardCommunity } from './CardCommunity'
import { RemoveAmountPicker } from '../card/RemoveAmountPicker'

interface RemoveModalProps {
  community: CommunityDetail
  setShowConfirmModal: (val: boolean) => void
}

export function RemoveModal({ community, setShowConfirmModal }: RemoveModalProps) {
  return (
    <ColumnFlexDiv>
      <CardCommunity community={community} />
      <RemoveAmountPicker community={community} setShowConfirmModal={setShowConfirmModal} />
    </ColumnFlexDiv>
  )
}
