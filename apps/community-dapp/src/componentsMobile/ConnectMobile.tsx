import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { shortenAddress } from '@usedapp/core'
import infoIcon from '../assets/images/info.svg'
import { Colors } from '../constants/styles'
import { AccountWrap, Account, StyledNavLink, Subnav, Warning, SubnavButton } from '../components/top/TopBar'
import { ConnectButton } from '../components/ConnectionNetwork'
import { useAccount } from '../hooks/useAccount'
import { config } from '../config'

export const ConnectMobile = () => {
  const { account, isActive, disconnect, switchNetwork, connect } = useAccount()
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    window.addEventListener('click', () => setIsOpened(false))
    return () => {
      window.removeEventListener('click', () => setIsOpened(false))
    }
  }, [])

  return (
    <MenuContentMobile>
      <StyledNavLinkInfo activeClassName="active-page" to="/info" />
      {account ? (
        <AccountWrap>
          <Account
            onClick={(e) => {
              e.stopPropagation()
              setIsOpened(!isOpened)
            }}
            isActive={isActive}
          >
            {shortenAddress(account)}
          </Account>
          <Subnav className={isOpened ? 'opened' : undefined}>
            {!isActive && (
              <>
                <Warning>⚠️ Unsupported network</Warning>
                <SubnavButton
                  className={isOpened ? 'opened' : undefined}
                  onClick={() => switchNetwork(config.usedappConfig.readOnlyChainId!)}
                >
                  Switch network
                </SubnavButton>
              </>
            )}

            <SubnavButton className={isOpened ? 'opened' : undefined} onClick={() => disconnect()}>
              Disconnect
            </SubnavButton>
          </Subnav>
        </AccountWrap>
      ) : (
        <ConnectButton autoWidth onClick={connect}>
          Connect
        </ConnectButton>
      )}
    </MenuContentMobile>
  )
}

const MenuContentMobile = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 16px;
  background-color: ${Colors.GrayLight};
`
const StyledNavLinkInfo = styled(StyledNavLink)`
  width: 20px;
  height: 20px;
  padding: 0;
  background-image: url(${infoIcon});
  background-repeat: no-repeat;

  &.active-page::after {
    width: 0;
  }
`
