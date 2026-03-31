import React, { ReactNode, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../constants/styles'
import { StyledNavLink } from '../components/top/TopBar'
import { PageInfo } from '../components/PageInfo'
import { ConnectMobile } from './ConnectMobile'

interface TopBarMobileProps {
  heading: string
  text: string
  type: number
  children?: ReactNode
}

export const TopBarMobile = ({ heading, text, children, type }: TopBarMobileProps) => {
  const scrollHeight = useRef(document.documentElement.scrollTop)
  const [scrollingUp, setScrollingUp] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const newScrollHeight = document.documentElement.scrollTop
      setScrollingUp((prev) => {
        const newPos = prev + scrollHeight.current - newScrollHeight

        if (newPos > 0) return 0
        if (type == 0) {
          if (window.innerWidth < 340) {
            if (newPos < -206) {
              return -206
            } else {
              return newPos
            }
          }
        }
        if (type == 1) {
          if (window.innerWidth > 554) {
            if (newPos < -169) {
              return -169
            } else {
              return newPos
            }
          }
        }
        if (newPos < -186) {
          return -186
        }
        return newPos
      })
      scrollHeight.current = newScrollHeight
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <HeaderMobile style={{ top: scrollingUp }}>
      <HeaderWrapperMobile>
        <ConnectMobile />
        <PageInfo heading={heading} text={text} />
        <NavigationMobile>
          <NavLinks>
            <NavItemMobile>
              <StyledNavLinkMobile activeClassName="active-page" to="/votes">
                Votes
              </StyledNavLinkMobile>
            </NavItemMobile>
            <NavItemMobile>
              <StyledNavLinkMobile activeClassName="active-page" to="/directory">
                Directory
              </StyledNavLinkMobile>
            </NavItemMobile>
            <NavItemMobile>
              <StyledNavLinkMobile activeClassName="active-page" to="/featured">
                Featured
              </StyledNavLinkMobile>
            </NavItemMobile>
          </NavLinks>
        </NavigationMobile>
      </HeaderWrapperMobile>
      {children}
    </HeaderMobile>
  )
}

const HeaderMobile = styled.header`
  position: fixed;
  width: 100%;
  background-color: ${Colors.GrayLight};
  left: 0px;
  z-index: 100;
  height: 186px;

  @media (max-width: 340px) {
    height: 205px;
  }
`

export const HeaderWrapperMobile = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(189, 93, 226, 0.15);
  width: 100%;
`

const NavigationMobile = styled.nav`
  width: 100%;
  height: 41px;
  bottom: 0;
`

const NavLinks = styled.ul`
  display: flex;
  justify-content: space-between;
  height: 100%;
  color: ${Colors.Black};
`

const NavItemMobile = styled.li`
  width: 50%;
  display: flex;
  align-items: center;
`

const StyledNavLinkMobile = styled(StyledNavLink)`
  width: 100%;
  font-size: 15px;
  line-height: 22px;
  padding: 12px 0;
  text-align: center;

  &.active-page::after {
    content: '';
    width: 100%;
    height: 2px;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);

    @media (max-width: 600px) {
      width: 100%;
    }
  }
`
