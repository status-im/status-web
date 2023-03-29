import { useMemo, useRef, useState } from 'react'

import {
  AnchorActions,
  CHANNEL_GROUPS,
  Composer,
  Messages,
  Sidebar,
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
  imageUrl:
    'https://images.unsplash.com/photo-1574786527860-f2e274867c91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1764&q=80',
}

const updateProperty = (property: string, value: number) => {
  document.documentElement.style.setProperty(property, `${value}px`)
}

function App() {
  const [showMembers, setShowMembers] = useState(false)

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
      updateProperty('--topbar-height', height)
    },
  })

  useResizeObserver<HTMLDivElement>({
    ref: composerRef,
    onResize({ height }) {
      updateProperty('--composer-height', height)
    },
  })

  const scrollPosition = useScrollPosition({
    ref: contentRef,
  })

  return (
    <div id="app">
      <div id="sidebar" style={{ zIndex: 200 }}>
        <Sidebar
          community={COMMUNITY}
          selectedChannelId={appState.channelId}
          onChannelPress={channelId =>
            appDispatch({ type: 'set-channel', channelId })
          }
        />
      </div>

      <main id="main">
        <div id="topbar" ref={topbarRef}>
          <Topbar
            blur={scrollPosition !== 'top'}
            channel={selectedChannel}
            showMembers={showMembers}
            onMembersPress={() => setShowMembers(show => !show)}
          />
        </div>

        <div id="content" ref={contentRef}>
          <div id="messages">
            <Messages />
          </div>
        </div>

        <div id="composer" ref={composerRef}>
          {scrollPosition !== 'bottom' && (
            <div id="anchor-actions">
              <AnchorActions />
            </div>
          )}
          <Composer blur={scrollPosition !== 'bottom'} />
        </div>
      </main>

      {showMembers && (
        <div id="members">
          <SidebarMembers />
        </div>
      )}
    </div>
  )
}

export default App
