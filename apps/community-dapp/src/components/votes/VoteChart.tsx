import React, { useEffect, useState } from 'react'
import _CountUp from 'react-countup'
// Workaround: react-countup resolves @types/react@19 in pnpm store, conflicting with React 17
const CountUp = _CountUp as any
import styled from 'styled-components'
import { Colors } from '../../constants/styles'
import { addCommas } from '../../helpers/addCommas'
import { VoteType, voteTypes } from './../../constants/voteTypes'
import { CurrentVoting } from '../../models/community'
import { VoteGraphBar } from './VoteGraphBar'
import { formatTimeLeft, formatTimeLeftVerification } from '../../helpers/fomatTimeLeft'
import { useTimeLeft } from '../../hooks/useTimeLeft'
export interface VoteChartProps {
  vote: CurrentVoting
  votesFor: number
  votesAgainst: number
  voteWinner?: number
  proposingAmount?: number
  selectedVote?: VoteType
  isAnimation?: boolean
  tabletMode?: (val: boolean) => void
}

export function VoteChart({
  vote,
  votesFor,
  votesAgainst,
  voteWinner,
  proposingAmount,
  selectedVote,
  isAnimation,
  tabletMode,
}: VoteChartProps) {
  const [mobileVersion, setMobileVersion] = useState(false)

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

  const timeLeft = useTimeLeft(vote.votingEndAt)
  const timeLeftVerification = useTimeLeft(vote.verificationEndAt)

  const voteConstants = voteTypes[vote.type]

  const voteSum = votesFor + votesAgainst
  const graphAgaintsWidth = (100 * votesAgainst) / voteSum

  const iconWinnerFont = mobileVersion ? '36px' : '42px'

  return (
    <Votes>
      <VotesChart className={selectedVote || tabletMode ? '' : 'notModal'}>
        <VoteBox
          style={{
            filter: voteWinner && voteWinner === 2 ? 'grayscale(1)' : 'none',
            textAlign: mobileVersion ? 'start' : 'center',
          }}
        >
          <p
            style={{ fontSize: voteWinner === 1 ? iconWinnerFont : '24px', marginTop: voteWinner === 2 ? '18px' : '0' }}
          >
            {voteConstants.against.icon}
          </p>
          <span>
            {' '}
            {isAnimation && proposingAmount && selectedVote && selectedVote.type === 0 ? (
              <CountUp end={votesAgainst} separator="," />
            ) : (
              addCommas(votesAgainst)
            )}{' '}
            <span style={{ fontWeight: 'normal' }}>SNT</span>
          </span>
        </VoteBox>
        <TimeLeft className={selectedVote ? '' : 'notModal'}>
          {timeLeft > 0 ? formatTimeLeft(timeLeft) : formatTimeLeftVerification(timeLeftVerification)}
        </TimeLeft>
        <VoteBox
          style={{
            filter: voteWinner && voteWinner === 1 ? 'grayscale(1)' : 'none',
            textAlign: mobileVersion ? 'end' : 'center',
          }}
        >
          <p
            style={{ fontSize: voteWinner === 2 ? iconWinnerFont : '24px', marginTop: voteWinner === 1 ? '18px' : '0' }}
          >
            {voteConstants.for.icon}
          </p>
          <span>
            {' '}
            {isAnimation && proposingAmount && selectedVote && selectedVote.type === 1 ? (
              <CountUp end={votesFor} separator="," />
            ) : (
              addCommas(votesFor)
            )}{' '}
            <span style={{ fontWeight: 'normal' }}>SNT</span>
          </span>
        </VoteBox>
      </VotesChart>
      <VoteGraphBarWrap className={selectedVote || tabletMode ? '' : 'notModal'}>
        <VoteGraphBar
          graphWidth={graphAgaintsWidth}
          balanceWidth={graphAgaintsWidth}
          voteWinner={voteWinner}
          isAnimation={isAnimation}
        />
        <TimeLeftMobile className={selectedVote ? '' : 'notModal'}>{formatTimeLeft(timeLeft)}</TimeLeftMobile>
      </VoteGraphBarWrap>
    </Votes>
  )
}

const Votes = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  width: 100%;
  position: relative;

  @media (max-width: 600px) {
    margin-bottom: 0;
  }
`
const VotesChart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 13px;

  &.notModal {
    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  }
`

const VoteBox = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  font-size: 12px;
  text-align: center;
  font-weight: normal;

  & > p {
    font-size: 24px;
    line-height: 100%;
  }

  & > span {
    font-weight: bold;
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    min-width: 70px;
  }

  @media (max-width: 600px) {
    min-width: unset;
  }
`

const TimeLeft = styled.div`
  position: absolute;
  top: 50%;
  left: calc(50%);
  transform: translateX(-50%);
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${Colors.GreyText};

  &.notModal {
    @media (max-width: 768px) {
      top: -16px;
    }

    @media (max-width: 600px) {
      top: unset;
    }
  }
`

const TimeLeftMobile = styled.div`
  position: absolute;
  bottom: -23px;
  left: calc(50%);
  transform: translateX(-50%);
  font-size: 0;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${Colors.GreyText};

  @media (max-width: 600px) {
    font-size: 12px;
  }
`

const VoteGraphBarWrap = styled.div`
  position: static;
  display: flex;
  justify-content: center;

  &.notModal {
    @media (max-width: 768px) {
      position: absolute;
      width: 65%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    @media (max-width: 600px) {
      width: 70%;
    }
  }
`
