import React from 'react'
import styled from 'styled-components'
import { ButtonPrimary } from '../Button'
import { Colors } from '../../constants/styles'

export type VoteFilterProps = {
  voteType: string
  setVoteType: (value: string) => void
}

export const VoteFilter = ({ voteType, setVoteType }: VoteFilterProps) => {
  return (
    <VoteFilterBlock>
      <VoteFilterHeading>Vote types:</VoteFilterHeading>
      <VoteTypeWrapper>
        <VoteType className={voteType == '' ? 'selected' : 'notSelected'} onClick={() => setVoteType('')}>
          All
        </VoteType>
        <VoteType className={voteType == 'Add' ? 'selected' : 'notSelected'} onClick={() => setVoteType('Add')}>
          Add
        </VoteType>
        <VoteType className={voteType == 'Remove' ? 'selected' : 'notSelected'} onClick={() => setVoteType('Remove')}>
          Remove
        </VoteType>
      </VoteTypeWrapper>
    </VoteFilterBlock>
  )
}

export const VoteFilterBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 310px;
  color: ${Colors.VioletDark};

  @media (max-width: 900px) {
    width: 450px;
    margin-top: 16px;
  }

  @media (max-width: 500px) {
    justify-content: center;
    width: 100%;
  }
`

export const VoteTypeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 220px;
  background-color: ${Colors.VioletSecondaryLight};
  padding: 4px;
  border-radius: 8px;

  @media (max-width: 900px) {
    width: 343px;
  }
`

const VoteFilterHeading = styled.span`
  @media (max-width: 500px) {
    display: none;
  }
`

export const VoteType = styled(ButtonPrimary)`
  display: flex;
  justify-content: center;
  background-color: ${Colors.Violet};
  color: ${Colors.White};
  line-height: 22px;
  font-weight: 500;
  padding: 5px 12px;

  @media (max-width: 900px) {
    width: 101px;
    text-align: center;
  }

  &:not(:disabled):active,
  &:not(:disabled):focus {
    background: ${Colors.Violet};
  }

  &:not(:disabled):hover {
    background: ${Colors.VioletDark};
    color: ${Colors.White};
  }

  &.notSelected {
    background: none;
    color: ${Colors.VioletDark};
  }
`
