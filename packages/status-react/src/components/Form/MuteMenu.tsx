import React, { useCallback } from 'react'

import styled from 'styled-components'

import { DropdownMenu, MenuItem, MenuText } from './DropdownMenu'

interface SubMenuProps {
  setIsMuted: (val: boolean) => void
  className?: string
}

export const MuteMenu = ({ setIsMuted, className }: SubMenuProps) => {
  const muteChannel = useCallback(
    (timeout: number) => {
      setIsMuted(true)
      const timer = setTimeout(() => setIsMuted(false), timeout * 6000000)
      return () => {
        clearTimeout(timer)
      }
    },
    [setIsMuted]
  )

  return (
    <MuteDropdown className={className}>
      <MenuItem onClick={() => muteChannel(0.25)}>
        <MenuText>For 15 min</MenuText>
      </MenuItem>
      <MenuItem onClick={() => muteChannel(1)}>
        <MenuText>For 1 hour</MenuText>
      </MenuItem>
      <MenuItem onClick={() => muteChannel(8)}>
        <MenuText>For 8 hours</MenuText>
      </MenuItem>
      <MenuItem onClick={() => muteChannel(24)}>
        <MenuText>For 24 hours</MenuText>
      </MenuItem>
      <MenuItem onClick={() => setIsMuted(true)}>
        <MenuText>Until I turn it back on</MenuText>
      </MenuItem>
    </MuteDropdown>
  )
}

const MuteDropdown = styled(DropdownMenu)`
  width: 176px;
  top: 100%;
  right: -60px;
  z-index: 3;

  &.side {
    width: 176px;
    top: -8px;
    left: 100%;
    right: unset;
  }

  &.narrow,
  &.sideNarrow {
    width: 176px;
    top: 100%;
    right: -16px;
    z-index: 3;
  }
`
