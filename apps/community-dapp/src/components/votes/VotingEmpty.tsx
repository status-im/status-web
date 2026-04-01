import React, { useEffect, useState } from 'react'
import { InfoHeading, InfoText } from '../PageInfo'
import { Modal } from '../Modal'
import { ProposeModal } from '../card/ProposeModal'
import { VoteConfirmModal } from '../card/VoteConfirmModal'
import { CommunityDetail } from '../../models/community'
import { ProposeButton } from '../Button'
import { ConnectionNetwork } from '../ConnectionNetwork'
import styled from 'styled-components'
import { Colors, ColumnFlexDiv } from '../../constants/styles'
import { useAccount } from '../../hooks/useAccount'
import { useWaku } from '../../providers/waku/provider'

export function VotingEmpty() {
  const { isActive } = useAccount()
  const { isConnected } = useWaku()
  const [showProposeModal, setShowProposeModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [communityFound, setCommunityFound] = useState<undefined | CommunityDetail>(undefined)
  const [mobileVersion, setMobileVersion] = useState(false)

  const setNext = (val: boolean) => {
    setShowConfirmModal(val)
    setShowProposeModal(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setMobileVersion(true)
      } else {
        setMobileVersion(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div>
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
      <VotingEmptyWrap>
        <p>😲</p>

        <ColumnFlexDiv>
          <EmptyHeading>There are no ongoing votes at the moment!</EmptyHeading>
          <EmptyText>
            If you know of a community that you think should be added to the Community Directory, feel free to propose
            it's addition by starting a vote
          </EmptyText>
        </ColumnFlexDiv>

        {!mobileVersion && (
          <>
            {isActive && (
              <ProposeButton onClick={() => setShowProposeModal(true)} disabled={!isConnected}>
                Propose community
              </ProposeButton>
            )}
            <ConnectionNetwork />
          </>
        )}
      </VotingEmptyWrap>
    </div>
  )
}

const VotingEmptyWrap = styled.div`
  position: absolute;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 96px);
  background: ${Colors.White};
  z-index: 99;

  @media (max-width: 600px) {
    height: 250px;
    top: 50vh;
    padding: 0 16px;
  }

  & > p {
    font-weight: bold;
    font-size: 64px;
    line-height: 64%;
    margin-bottom: 24px;

    @media (max-width: 600px) {
      font-size: 44px;
    }

    @media (max-width: 375px) {
      font-size: 34px;
    }
  }
`

const EmptyHeading = styled(InfoHeading)`
  @media (max-width: 375px) {
    font-size: 20px;
  }
`

const EmptyText = styled(InfoText)`
  @media (max-width: 340px) {
    font-size: 12px;
  }
`
