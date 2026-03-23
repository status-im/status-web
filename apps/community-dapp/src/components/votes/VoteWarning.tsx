import React from 'react'
import styled from 'styled-components'

type VoteWarningProps = {
  icon: string
  text: string
}

export function Warning({ icon, text }: VoteWarningProps) {
  return (
    <VoteWarning>
      <span>{icon}</span>
      <WarningText>{text}</WarningText>
    </VoteWarning>
  )
}

const VoteWarning = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px;
  background: #ffeff2;
  border-radius: 6px;
  margin-top: 32px;
  margin-bottom: 32px;
  @media (max-width: 600px) {
    justify-content: flex-start;
    margin-top: 24px;
  }

  & > span {
    font-size: 24px;
    line-height: 32px;
  }
`

const WarningText = styled.div`
  max-width: 353px;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;

  @media (max-width: 600px) {
    margin-left: 10px;
    max-width: 100%;
  }
`
