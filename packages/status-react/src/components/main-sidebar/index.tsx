import React from 'react'

import { useAppState } from '~/src/contexts/app-context'
import { styled } from '~/src/styles/config'
import { Separator } from '~/src/system'

import { Channels } from './components/channels'
import { CommunityInfo } from './components/community-info'
import { GetStarted } from './components/get-started'
import { Messages } from './components/messages'

export const MainSidebar = () => {
  const { options } = useAppState()

  if (options.enableSidebar === false) {
    return null
  }

  return (
    <Wrapper>
      <CommunityInfo />
      <Channels />
      <Separator css={{ margin: '16px 0' }} />
      <Messages />
      <Separator css={{ margin: '16px 0' }} />
      <GetStarted />
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
