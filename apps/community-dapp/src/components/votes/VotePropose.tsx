import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { Colors, ColumnFlexDiv } from '../../constants/styles'
import { addCommas } from '../../helpers/addCommas'
import { useAvailableAmount } from '../../hooks/useAvailableAmount'
import { CurrentVoting } from '../../models/community'
import { Input } from '../Input'
import { Warning } from './VoteWarning'

export interface VoteProposingProps {
  vote?: CurrentVoting
  selectedVote?: {
    noun: string
  }
  setProposingAmount: (show: number) => void
  proposingAmount: number
  disabled?: boolean
}

export function VotePropose({ vote, selectedVote, proposingAmount, disabled, setProposingAmount }: VoteProposingProps) {
  const availableAmount = useAvailableAmount()

  const [displayAmount, setDisplayAmount] = useState(addCommas(proposingAmount) + ' SNT')

  useEffect(() => {
    setProposingAmount(availableAmount)
    setDisplayAmount(addCommas(availableAmount) + ' SNT')
  }, [availableAmount])

  let step = 10 ** (Math.floor(Math.log10(availableAmount)) - 2)
  if (availableAmount < 100) {
    step = 1
  }

  const setAvailableAmount = useCallback(() => {
    setProposingAmount(availableAmount)
    setDisplayAmount(addCommas(availableAmount) + ' SNT')
  }, [availableAmount])

  const sliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) == step * Math.floor(availableAmount / step)) {
      setAvailableAmount()
    } else {
      setProposingAmount(Number(e.target.value))
      setDisplayAmount(addCommas(Number(e.target.value)) + ' SNT')
    }
  }

  const progress = (proposingAmount / availableAmount) * 100 + '%'

  const onInputAmountBlur = () => {
    if (proposingAmount > availableAmount) {
      setAvailableAmount()
    } else {
      setDisplayAmount(addCommas(proposingAmount) + ' SNT')
    }
  }

  return (
    <VoteProposing>
      <VoteProposingInfo>
        <p>My vote</p>
        <span>Available {addCommas(availableAmount)} SNT</span>
      </VoteProposingInfo>
      <VoteProposingAmount
        value={displayAmount}
        onInput={(e) => {
          setProposingAmount(Number(e.currentTarget.value))
          setDisplayAmount(e.currentTarget.value)
        }}
        onBlur={onInputAmountBlur}
        onFocus={() => setDisplayAmount(proposingAmount.toString())}
      />
      <VoteProposingRangeWrap>
        <VoteProposingRange
          type="range"
          min={0}
          max={availableAmount}
          step={step}
          value={proposingAmount}
          onChange={sliderChange}
          isDisabled={disabled}
          style={{
            background: disabled
              ? Colors.GrayDisabledLight
              : `linear-gradient(90deg, ${Colors.VioletDark} 0% ${progress},  ${Colors.VioletSecondary} ${progress} 100%)`,
          }}
        />
      </VoteProposingRangeWrap>

      {vote?.type === 'Remove' && Number(proposingAmount) > 2000000 && vote.timeLeft / 3600 > 24 && (
        <Warning
          icon="⚠️"
          text={`Your vote will shorten vote duration! Votes over 2,000,000 SNT for ${selectedVote?.noun} of the community shortens the vote duration to 24 hours.`}
        />
      )}
    </VoteProposing>
  )
}

export const VoteProposing = styled(ColumnFlexDiv)`
  width: 100%;
`
const VoteProposingInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;

  & > span {
    font-size: 12px;
    line-height: 16px;
    color: ${Colors.GreyText};
  }
`

const VoteProposingAmount = styled(Input)`
  width: 100%;
  margin-bottom: 16px;
  font-size: 15px;
  line-height: 22px;
`

const VoteProposingRangeWrap = styled.div`
  width: 294px;
`

const VoteProposingRange = styled.input<{ isDisabled?: boolean }>`
  appearance: none;
  width: 100%;
  height: 4px;
  padding: 0;
  margin: 10px 0;
  border-radius: 2px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ isDisabled }) => (isDisabled ? Colors.GrayDisabledDark : Colors.Violet)};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: ${({ isDisabled }) => (isDisabled ? Colors.GrayDisabledDark : Colors.Violet)};
    border: 0.5px solid rgba(0, 0, 0, 0);
    border-radius: 50px;
    cursor: pointer;
  }
`
