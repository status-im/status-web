import React from 'react'

import { styled } from '~/src/styles/config'

import { Channels } from './components/channels'
import { CommunityInfo } from './components/community-info'
import { GetStarted } from './components/get-started'
import { Messages } from './components/messages'

export const MainSidebar = () => {
  return (
    <Wrapper>
      <CommunityInfo />
      <Channels />
      <Separator />
      <Messages />
      <Separator />
      <GetStarted />
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  width: 304,
  flexShrink: 0,
  flexDirection: 'column',
  padding: '10px 16px',
  display: 'none',
  backgroundColor: '#F6F8FA',
  overflowY: 'scroll',

  '@medium': {
    display: 'flex',
  },
})

const Separator = styled('div', {
  margin: '16px 0',
  height: 1,
  background: 'rgba(0, 0, 0, 0.1)',
  flexShrink: 0,
})
