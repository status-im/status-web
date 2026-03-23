import React, { useState } from 'react'
import { InfoWrap, PageInfo } from '../PageInfo'
import { Modal } from '../Modal'
import { ProposeModal } from '../card/ProposeModal'
import { VoteConfirmModal } from '../card/VoteConfirmModal'
import { CommunityDetail } from '../../models/community'
import { ProposeButton } from '../Button'
import { ConnectionNetwork } from '../ConnectionNetwork'
import { useAccount } from '../../hooks/useAccount'
import { useWaku } from '../../providers/waku/provider'

export function VotesInfo() {
  const { isActive } = useAccount()
  const { isConnected } = useWaku()

  const [showProposeModal, setShowProposeModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [communityFound, setCommunityFound] = useState<undefined | CommunityDetail>(undefined)

  const setNext = (val: boolean) => {
    setShowConfirmModal(val)
    setShowProposeModal(false)
  }

  return (
    <InfoWrap>
      <PageInfo
        heading="Ongoing Votes"
        text="Help curate the Status Communities directory by voting which communities should be included"
      />
      {showProposeModal && (
        <Modal heading="Add community to directory" setShowModal={setShowProposeModal}>
          <ProposeModal
            setShowConfirmModal={setNext}
            setCommunityFound={setCommunityFound}
            communityFound={communityFound}
          />
        </Modal>
      )}
      {showConfirmModal && communityFound && (
        <Modal setShowModal={setShowConfirmModal}>
          <VoteConfirmModal
            community={communityFound}
            selectedVote={{ verb: 'to add' }}
            setShowModal={setShowConfirmModal}
          />
        </Modal>
      )}

      {isActive && (
        <ProposeButton onClick={() => setShowProposeModal(true)} disabled={!isConnected}>
          Propose community
        </ProposeButton>
      )}
      <ConnectionNetwork />
    </InfoWrap>
  )
}
