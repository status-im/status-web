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
import { useBlur } from '@status-im/components/hooks'

const COMMUNITY = {
  name: 'Rarible',
  description:
    'Multichain community-centric NFT marketplace. Create, buy and sell your NFTs.',
  membersCount: 123,
  imageUrl:
    'https://images.unsplash.com/photo-1574786527860-f2e274867c91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1764&q=80',
}

function App() {
  const [showMembers, setShowMembers] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const { shouldBlurTop, shouldBlurBottom } = useBlur({
    ref: containerRef,
  })

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
        <Topbar
          blur={shouldBlurTop}
          channel={selectedChannel}
          showMembers={showMembers}
          onMembersPress={() => setShowMembers(show => !show)}
        />

        <div id="content" ref={containerRef}>
          <div id="messages">
            <Messages />
          </div>
          <div id="composer">
            <div id="anchor-actions">
              <AnchorActions scrolled={shouldBlurBottom} />
            </div>
            <Composer blur={shouldBlurBottom} />
          </div>
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
