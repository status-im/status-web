import React from 'react'

import styled from 'styled-components'

import { MobileIcon } from '../Icons/MobileIcon'
import { ProfileIcon } from '../Icons/ProfileIcon'
import { ScanIcon } from '../Icons/ScanIcon'
import { textMediumStyles } from '../Text'

interface LoginInstructionsProps {
  mobileFlow: boolean
}

export function LoginInstructions({ mobileFlow }: LoginInstructionsProps) {
  return (
    <Instructions>
      <InstructionStep>
        Open Status App on your {mobileFlow ? 'mobile' : 'desktop'}
      </InstructionStep>
      <InstructionStep>
        Navigate yourself to{' '}
        <InstructionIcon>
          {' '}
          <ProfileIcon width={13} height={13} /> <span>Profile</span>
        </InstructionIcon>{' '}
        tab
      </InstructionStep>
      <InstructionStep>
        Select{' '}
        <InstructionIcon>
          <MobileIcon />
        </InstructionIcon>{' '}
        <span>Sync Settings</span>
      </InstructionStep>
      <InstructionStep>
        Tap{' '}
        <InstructionIcon>
          {' '}
          <ScanIcon />{' '}
        </InstructionIcon>{' '}
        <span>{mobileFlow ? 'Scan' : 'Display'} sync code</span>
      </InstructionStep>
      <InstructionStep>
        {mobileFlow
          ? 'Scan the sync code from this screen'
          : 'Paste the sync code above'}{' '}
        ↑
      </InstructionStep>
    </Instructions>
  )
}

const Instructions = styled.ol`
  color: ${({ theme }) => theme.secondary};
  margin: auto 0;
  list-style-type: decimal;
  counter-reset: ollist;

  ${textMediumStyles}
`

const InstructionStep = styled.li`
  display: flex;
  align-items: center;

  & + & {
    margin-top: 10px;
  }

  & > span {
    color: ${({ theme }) => theme.tertiary};
  }

  &::before {
    counter-increment: ollist;
    content: counter(ollist) '.';
    margin-right: 4px;
  }
`

const InstructionIcon = styled.div`
  width: 40px;
  height: 40px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.tertiary};
  font-size: 8px;
  line-height: 10px;
  margin: 0 6px;
`
