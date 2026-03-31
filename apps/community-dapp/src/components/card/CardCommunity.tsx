import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants/styles'
import { CommunityDetail, CurrentVoting } from '../../models/community'
import { LinkExternal, LinkInternal } from '../Link'
import { Modal } from '../Modal'
import { VoteConfirmModal } from './VoteConfirmModal'
import binIcon from '../../assets/images/bin.svg'
import { RemoveModal } from './RemoveModal'
import { CardHeading } from '../Card'
import { useEthers, ChainId } from '@usedapp/core'
import { useHistory } from 'react-router'
import { useAccount } from '../../hooks/useAccount'
import { config } from '../../config'

interface CardCommunityProps {
  community: CommunityDetail
  showRemoveButton?: boolean
  customHeading?: string
  customStyle?: boolean
  currentVoting?: CurrentVoting
}

export const CardCommunity = ({
  community,
  showRemoveButton,
  customHeading,
  customStyle,
  currentVoting,
}: CardCommunityProps) => {
  const { chainId } = useEthers()
  const { isActive } = useAccount()

  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const setNewModal = (val: boolean) => {
    setShowConfirmModal(val)
    setShowRemoveModal(false)
  }
  const history = useHistory()

  const handleMobileRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.innerWidth < 600) {
      history.push(`/removal/${community.publicKey}`)
    } else {
      setShowRemoveModal(true)
    }
  }, [])
  const isDisabled = community.votingHistory.length === 0

  return (
    <CardCommunityBlock className={customStyle ? 'notModal' : ''}>
      {showHistoryModal && (
        <Modal heading={`${community.name} voting history`} setShowModal={setShowHistoryModal}>
          <VoteHistoryTable>
            <tbody>
              <tr>
                <VoteHistoryTableColumnCellDate>Date</VoteHistoryTableColumnCellDate>
                <VoteHistoryTableColumnCell>Type</VoteHistoryTableColumnCell>
                <VoteHistoryTableColumnCell>Result</VoteHistoryTableColumnCell>
              </tr>
              {community.votingHistory.map((vote) => {
                return (
                  <tr key={vote.ID}>
                    <VoteHistoryTableCell>{vote.date.toLocaleDateString()}</VoteHistoryTableCell>
                    <VoteHistoryTableCell>{vote.type}</VoteHistoryTableCell>
                    <VoteHistoryTableCell>{vote.result}</VoteHistoryTableCell>
                  </tr>
                )
              })}
            </tbody>
          </VoteHistoryTable>
        </Modal>
      )}
      {showRemoveModal && (
        <Modal
          heading="Remove from directory?"
          setShowModal={(val: boolean) => {
            setShowRemoveModal(val)
          }}
        >
          <RemoveModal community={community} setShowConfirmModal={setNewModal} />{' '}
        </Modal>
      )}
      {showConfirmModal && (
        <Modal setShowModal={setNewModal}>
          <VoteConfirmModal community={community} selectedVote={{ verb: 'to remove' }} setShowModal={setNewModal} />
        </Modal>
      )}
      <Community>
        <CardLogoWrap>
          {community.icon && <CardLogo src={community.icon} alt={`${community.name} logo`} />}
          {showRemoveButton && !currentVoting && <RemoveBtnMobile onClick={handleMobileRemove} disabled={!isActive} />}
        </CardLogoWrap>

        <CommunityInfo>
          <CardTop>
            <CardHeading>{customHeading ? customHeading : community.name}</CardHeading>
            {showRemoveButton && !currentVoting && (
              <RemoveBtn onClick={() => setShowRemoveModal(true)} disabled={!isActive} />
            )}
          </CardTop>
          <CardText>{community.description}</CardText>
          <CardTags>
            {community.tags.map((tag, key) => (
              <Tag key={key}>
                <p>{tag}</p>
              </Tag>
            ))}
          </CardTags>
        </CommunityInfo>
      </Community>
      <CardLinks className={customStyle ? 'notModal' : ''}>
        <LinkExternal href={community.link} target="_blank" rel="noopener noreferrer">
          Visit community
        </LinkExternal>
        <LinkExternal
          href={
            config.usedappConfig.networks
              ?.find((chain) => chain.chainId === chainId)
              ?.getExplorerAddressLink(config.contracts[chainId as ChainId]?.directoryContract || '') || '#'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Etherscan
        </LinkExternal>
        <HistoryLink onClick={() => setShowHistoryModal(true)} disabled={isDisabled}>
          Voting history
        </HistoryLink>
      </CardLinks>
    </CardCommunityBlock>
  )
}

export const CardCommunityBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  &.notModal {
    @media (max-width: 768px) {
      align-items: stretch;
    }
  }
`

const Community = styled.div`
  display: flex;
  margin-bottom: 16px;

  @media (max-width: 600px) {
    margin-bottom: 0;
  }
`

const CommunityInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const CardLogoWrap = styled.div`
  width: 64px;
  height: 64px;
  object-fit: cover;
  margin-right: 16px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 40px;
    height: 78px;
  }
`
const CardLogo = styled.img`
  width: 64px !important;
  height: 64px !important;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 40px !important;
    height: 40px !important;
  }
`

const CardTop = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  line-height: 24px;
`

const RemoveBtn = styled.button`
  width: 16px;
  height: 16px;
  margin-left: 16px;
  background-image: url(${binIcon});
  background-size: contain;
  background-repeat: no-repeat;

  &:disabled {
    filter: grayscale(1);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const RemoveBtnMobile = styled(RemoveBtn)`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-left: 0;
  }
`

const CardText = styled.p`
  line-height: 22px;
  margin-bottom: 8px;
  word-break: break-all;
`

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
`
const Tag = styled.div`
  margin: 0 8px 8px 0;
  padding: 0 10px;
  border: 1px solid ${Colors.VioletDark};
  box-sizing: border-box;
  border-radius: 10px;
  color: ${Colors.VioletDark};
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
`
export const CardLinks = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 15px;
  line-height: 22px;

  @media (max-width: 900px) {
    flex-wrap: wrap;
  }

  @media (max-width: 600px) {
    padding: 12px 20px 0;
  }

  &.notModal {
    @media (max-width: 768px) {
      max-width: calc(100% - 60px);
    }

    @media (max-width: 600px) {
      display: none;
    }
  }
`

const HistoryLink = styled(LinkInternal)`
  @media (max-width: 600px) {
    display: none;
  }
`

export const VoteHistoryTable = styled.table`
  width: 100%;
`

export const VoteHistoryTableColumnCell = styled.td`
  width: 33.3%;
  font-weight: bold;
  padding-bottom: 24px;
`
export const VoteHistoryTableColumnCellDate = styled(VoteHistoryTableColumnCell)`
  width: 40%;
`
export const VoteHistoryTableCell = styled.td`
  width: 33.3%;
  padding-bottom: 18px;
`
