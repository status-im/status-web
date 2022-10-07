import React from 'react'

import { useAppState } from '../../contexts/app-context'
import { useAccount } from '../../protocol'
import { styled } from '../../styles/config'
import { Separator } from '../../system'
import { Chats } from './components/chats'
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
      <Chats />

      {account?.membership !== 'approved' && (
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

  '@large': {
    display: 'flex',
  },
})
