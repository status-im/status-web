import React from 'react'

import { useAppState } from '../../contexts/app-context'
import { useAccount } from '../../protocol'
import { styled } from '../../styles/config'
import { Separator } from '../../system'
import { Channels } from './components/channels'
import { CommunityInfo } from './components/community-info'
import { GetStarted } from './components/get-started'

export const MainSidebar = () => {
  const { options } = useAppState()
  const { account } = useAccount()

  if (options.enableSidebar === false) {
    return null
  }

  return (
    <Wrapper>
      <CommunityInfo />
      <Channels />

      {!account && (
        <>
          <Separator />
          <GetStarted />
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  display: 'none',
  width: 304,
  flexShrink: 0,
  flexDirection: 'column',
  padding: '10px 16px',
  backgroundColor: '$gray-4',
  overflowY: 'scroll',

  '@large': {
    display: 'flex',
  },
})
