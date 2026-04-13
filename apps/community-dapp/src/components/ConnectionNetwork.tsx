import React from 'react'
import { ProposeButton } from './Button'
import { useAccount } from '../hooks/useAccount'
import { config } from '../config'
import { Warning } from './votes/VoteWarning'
import styled from 'styled-components'

export type ConnectionNetworkProps = {
  buttonText?: string
  autoWidth?: boolean
}

export function ConnectionNetwork({ buttonText, autoWidth = false }: ConnectionNetworkProps) {
  const { connect, account, error, switchNetwork } = useAccount()

  if (account && error?.name === 'ChainIdError') {
    return (
      <>
        <WarningWrapper>
          <Warning text="You are connected to unsupported network." icon="⚠️" />
        </WarningWrapper>
        <ProposeButton onClick={() => switchNetwork(config.usedappConfig.readOnlyChainId!)}>
          Switch Network
        </ProposeButton>
      </>
    )
  }

  if (!account) {
    return (
      <ConnectButton autoWidth={autoWidth} onClick={connect}>
        {!buttonText ? 'Connect to Vote' : buttonText}
      </ConnectButton>
    )
  }

  return null
}

const WarningWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;

  @media (max-width: 600px) {
    max-width: 100%;
  }
`

export const ConnectButton = styled(ProposeButton)<{ autoWidth: boolean }>`
  ${({ autoWidth }) =>
    autoWidth &&
    `
    width: auto;
    padding: 10px 27px;

    @media (max-width: 600px) {
      padding: 7px 27px;
      margin-top: -9px;
  }`}
`
