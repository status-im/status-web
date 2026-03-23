import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'
import { shortenAddress } from '@usedapp/core'
import logo from '../../assets/images/logo.svg'
import { Colors } from '../../constants/styles'
import { Animation } from '../../constants/animation'
import { ConnectButton } from '../ConnectionNetwork'
import { useAccount } from '../../hooks/useAccount'
import { config } from '../../config'

export function TopBar() {
  const { isActive, account, switchNetwork, disconnect, connect } = useAccount()
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    window.addEventListener('click', () => setIsOpened(false))
    return () => {
      window.removeEventListener('click', () => setIsOpened(false))
    }
  }, [])

  return (
    <Header>
      <HeaderWrapper>
        <Logo />
        <MenuContent>
          <Navigation>
            <NavLinks>
              <NavItem>
                <StyledNavLink activeClassName="active-page" to="/votes">
                  Votes
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink activeClassName="active-page" to="/directory">
                  Directory
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink activeClassName="active-page" to="/featured">
                  Featured
                </StyledNavLink>
              </NavItem>
              <NavItem>
                <StyledNavLink activeClassName="active-page" to="/info">
                  Info
                </StyledNavLink>
              </NavItem>
            </NavLinks>
          </Navigation>

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
                    <Warning>
                      <span>⚠️</span>
                      <span>Unsupported network</span>
                    </Warning>
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
        </MenuContent>
      </HeaderWrapper>
    </Header>
  )
}

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 96px;
  background-color: ${Colors.GrayLight};
  border-bottom: 1px solid rgba(189, 93, 226, 0.15);
  z-index: 100;
`

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  height: 100%;
  padding: 0 40px;
  margin: 0 auto;

  @media (max-width: 900px) {
    padding: 0 32px;
  }

  @media (max-width: 650px) {
    padding: 0 16px;
  }
`

const Logo = styled.div`
  width: 200px;
  height: 47px;
  background-image: url(${logo});
  background-size: contain;
  background-repeat: no-repeat;
`

const MenuContent = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  flex: 1;
  max-width: 780px;
  background-color: ${Colors.GrayLight};

  @media (max-width: 768px) {
    max-width: 440px;
  }
`

const Navigation = styled.nav`
  max-width: 500px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 290px;
  }
`

const NavLinks = styled.ul`
  display: flex;
  justify-content: space-between;
  height: 100%;
  color: ${Colors.Black};
`

const NavItem = styled.li`
  width: 124px;
  text-align: center;

  @media (max-width: 768px) {
    width: 80px;
  }

  @media (max-width: 650px) {
    width: 70px;
  }
`

export const StyledNavLink = styled(NavLink)`
  position: relative;
  color: ${Colors.Black};
  font-size: 17px;
  line-height: 18px;
  padding: 39px 0 37px;

  &:hover {
    color: ${Colors.Violet};
  }

  &:active {
    color: ${Colors.Black};
  }

  &.active-page::after {
    content: '';
    width: 124px;
    height: 2px;
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${Colors.Violet};
    bacground-position: center;
    border-radius: 1px;
    animation: ${Animation} 0.25s linear;

    @media (max-width: 768px) {
      width: 80px;
    }

    @media (max-width: 650px) {
      width: 70px;
    }
  }

  @media (max-width: 650px) {
    font-size: 15px;
  }
`

export const AccountWrap = styled.div`
  position: relative;
`

export const Account = styled.button<{ isActive: boolean }>`
  position: relative;
  font-weight: 500;
  font-size: 13px;
  line-height: 22px;
  color: ${Colors.Black};
  padding: 11px 16px 11px 28px;
  background: ${Colors.White};
  border: 1px solid ${Colors.GrayBorder};
  border-radius: 21px;
  outline: none;
  min-width: 150px;

  @media (max-width: 600px) {
    padding: 7px 12px 7px 28px;
    margin-top: -9px;
  }

  &:focus,
  &:active {
    border: 1px solid ${Colors.Violet};
  }

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    position: absolute;
    top: 50%;
    left: 17px;
    transform: translate(-50%, -50%);
    background-color: ${Colors.Red};
    bacground-position: center;
    border-radius: 50%;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      padding: 11px 16px 11px 28px;

      &::before {
        background-color: ${Colors.Green};
      }
    `}
`

export const Subnav = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  background: ${Colors.White};
  border: 1px solid ${Colors.GrayBorder};
  border-radius: 16px;
  box-shadow: 0px 2px 16px rgba(0, 9, 26, 0.12);
  transition: all 0.3s;
  outline: none;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;

  &.opened {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 10;
  }
`

export const SubnavButton = styled.button`
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  cursor: pointer;
  padding: 8px 16px;
  color: ${Colors.VioletDark};
  width: 100%;
  display: flex;
  justify-content: center;

  &:hover {
    background: ${Colors.VioletSecondaryDark};
  }

  &:active {
    background: ${Colors.VioletSecondaryLight};
  }
`

export const Warning = styled.div`
  font-size: 12px;
  padding: 16px 12px 6px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  line-height: 16px;
`
