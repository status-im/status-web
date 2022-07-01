import React from 'react'

import ContentLoader from 'react-content-loader'

import { styled } from '../../styles/config'
import { Box } from '../../system'

const CommunityInfoLoader = () => (
  <ContentLoader
    speed={2}
    width={185}
    height={50}
    viewBox="0 0 185 50"
    backgroundColor="var(--colors-accent-8)"
    foregroundColor="var(--colors-accent-5)"
  >
    <rect x="50" y="10" rx="3" ry="3" width="120" height="12" />
    <rect x="50" y="30" rx="3" ry="3" width="120" height="8" />
    <circle cx="24" cy="24" r="18" />
  </ContentLoader>
)

const ChatItemLoader = () => {
  return (
    <ContentLoader
      speed={2}
      width={272}
      height={40}
      viewBox="0 0 272 40"
      backgroundColor="var(--colors-accent-8)"
      foregroundColor="var(--colors-accent-5)"
    >
      <rect x="41" y="13" rx="3" ry="3" width="140" height="14" />
      <circle cx="20" cy="20" r="12" />
    </ContentLoader>
  )
}

export const Loading = () => {
  return (
    <Wrapper>
      <Sidebar>
        <CommunityInfoLoader />
        <Box css={{ padding: '8px 0' }}>
          <ChatItemLoader />
          <ChatItemLoader />
          <ChatItemLoader />
          <ChatItemLoader />
          <ChatItemLoader />
        </Box>
      </Sidebar>
      <Box css={{ padding: '6px 10px' }}>
        <CommunityInfoLoader />
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  background: '$background',
})

const Sidebar = styled('div', {
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
