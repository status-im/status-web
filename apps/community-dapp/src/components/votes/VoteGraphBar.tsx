import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../../constants/styles'
import indicatorIcon from '../../assets/images/indicator.svg'

function createKeyFrames(votesWidth: number, markerWidth: number) {
  return `
  @keyframes fade-in {  
    0% {
      width: ${votesWidth}%;
    }
    100% {
      width: ${markerWidth}%;
    }
  }
  `
}
export interface VoteGraphBarProps {
  balanceWidth?: number
  graphWidth?: number
  voteWinner?: number
  isAnimation?: boolean
}

export function VoteGraphBar({ graphWidth, balanceWidth, voteWinner, isAnimation }: VoteGraphBarProps) {
  const markerWidth: number = balanceWidth ? balanceWidth : 0
  const votesWidth: number = graphWidth ? graphWidth : 0
  const [keyFrames, setKeyFrames] = useState('')
  const [style, setStyle] = useState<{ width: string; animation?: string }>({ width: `${votesWidth}%` })

  useEffect(() => {
    if (isAnimation) {
      setStyle({ width: `${markerWidth}%`, animation: 'fade-in 2s ease' })
      setKeyFrames(createKeyFrames(votesWidth, markerWidth))
    } else {
      setStyle({ width: `${votesWidth}%` })
    }
  }, [isAnimation, votesWidth])

  return (
    <VoteGraph theme={{ voteWinner }}>
      <style children={keyFrames} />
      <VoteGraphAgainst theme={{ voteWinner }} style={style} />
      <VoteBalance style={{ width: `${markerWidth}%` }} />
    </VoteGraph>
  )
}

const VoteGraph = styled.div<VoteGraphBarProps>`
  position: relative;
  width: 100%;
  height: 16px;
  background-color: ${({ theme }) => (theme.voteWinner === 1 ? Colors.GrayDisabledLight : Colors.BlueBar)};
  border-radius: 10px;
  padding-top: 5px;
  border-left: 13px solid ${({ theme }) => (theme.voteWinner === 2 ? Colors.GrayDisabledLight : Colors.Orange)};
  border-right: 13px solid ${({ theme }) => (theme.voteWinner === 1 ? Colors.GrayDisabledLight : Colors.BlueBar)};

  @media (max-width: 600px) {
    height: 13px;
  }

  &::before {
    content: '';
    width: 16px;
    height: 5px;
    position: absolute;
    top: -6px;
    left: calc(50% - 2px);
    transform: translateX(-50%);
    background-image: url(${indicatorIcon});
    background-size: cover;

    @media (max-width: 768px) {
      width: 9px;
      height: 3px;
      left: 50%;
    }

    @media (max-width: 768px) {
      top: -4px;
    }
  }
`

const VoteGraphAgainst = styled.div<VoteGraphBarProps>`
  position: absolute;
  left: 0;
  top: 0;
  height: 16px;
  background-color: ${({ theme }) => (theme.voteWinner === 2 ? Colors.GrayDisabledLight : Colors.Orange)};
  transition: width 2s;
  z-index: 2;

  @media (max-width: 600px) {
    height: 13px;
  }
`

const VoteBalance = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 16px;
  background-color: transparent;
  border-right: 2px solid ${Colors.VioletLight};
  z-index: 2;

  @media (max-width: 600px) {
    height: 13px;
    transition: width 2s;
  }
`
