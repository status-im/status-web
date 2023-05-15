import { useEffect, useMemo, useRef, useState } from 'react'

import {
  AnchorActions,
  CHANNEL_GROUPS,
  Composer,
  Messages,
  SidebarCommunity,
  SidebarMembers,
  Topbar,
  useAppDispatch,
  useAppState,
} from '@status-im/components'
import useResizeObserver from 'use-resize-observer'

import { useScrollPosition } from './hooks/use-scroll-position'

const COMMUNITY = {
  name: 'Rarible',
  description:
    'Multichain community-centric NFT marketplace. Create, buy and sell your NFTs.',
  membersCount: 123,
  imageSrc:
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2264&q=80',
}

const updateProperty = (property: string, value: number) => {
  document.documentElement.style.setProperty(property, `${value}px`)
}

function App() {
  const [loading /*, setLoading*/] = useState(false)
  const [showMembers, setShowMembers] = useState(false)

  // TODO: Use it to simulate loading
  // useEffect(() => {
  //   setLoading(true)
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 2000)
  // }, [])

  const appState = useAppState()
  const appDispatch = useAppDispatch()

  // TODO: This should change based on the URL
  const selectedChannel = useMemo(() => {
    for (const { channels } of CHANNEL_GROUPS) {
      for (const channel of channels) {
        if (channel.id === appState.channelId) {
          return channel
        }
      }
    }
  }, [appState.channelId])

  const topbarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)

  useResizeObserver<HTMLDivElement>({
    ref: topbarRef,
    onResize({ height }) {
      updateProperty('--topbar-height', height!)
    },
  })

  useResizeObserver<HTMLDivElement>({
    ref: composerRef,
    onResize({ height }) {
      updateProperty('--composer-height', height!)
    },
  })

  const scrollPosition = useScrollPosition({
    ref: contentRef,
  })

  useEffect(() => {
    contentRef.current!.scrollTop = contentRef.current!.scrollHeight
  }, [selectedChannel])

  return (
    <div id="app">
      <div id="sidebar-community" style={{ zIndex: 200 }}>
        <SidebarCommunity
          community={COMMUNITY}
          selectedChannelId={appState.channelId}
          onChannelPress={channelId =>
            appDispatch({ type: 'set-channel', channelId })
          }
          loading={loading}
        />
      </div>

      <main id="main">
        <div id="topbar" ref={topbarRef}>
          <Topbar
            blur={scrollPosition !== 'top'}
            channel={selectedChannel!}
            showMembers={showMembers}
            onMembersPress={() => setShowMembers(show => !show)}
            pinnedMessages={[
              {
                text: 'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.',
                reactions: {},
                pinned: true,
                id: '1234-1234',
              },
              {
                text: 'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam.',
                reactions: {},
                pinned: true,
                id: '4321-4321',
              },
            ]}
            loading={loading}
          />
        </div>

        <div id="content" ref={contentRef}>
          <div id="messages">
            <Messages loading={loading} />
          </div>
        </div>

        {loading === false && (
          <div id="composer" ref={composerRef}>
            {scrollPosition !== 'bottom' && (
              <div id="anchor-actions">
                <AnchorActions />
              </div>
            )}
            <Composer blur={scrollPosition !== 'bottom'} />
          </div>
        )}
      </main>

      {showMembers && (
        <div id="sidebar-members">
          <SidebarMembers />
        </div>
      )}
    </div>
  )
}

export default App
