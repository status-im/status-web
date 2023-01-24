import { useState } from 'react'

import {
  Composer,
  Messages,
  Sidebar,
  SidebarMembers,
  Topbar,
} from '@status-im/components'
import { Stack, styled, TamaguiProvider } from '@tamagui/core'
import { AnimatePresence } from 'tamagui'

import tamaguiConfig from '../tamagui.config'

type ThemeVars = 'light' | 'dark'

const AnimatableDrawer = styled(Stack, {
  variants: {
    fromRight: {
      true: {
        x: 500,
        width: 0,
      },
    },
    fromLeft: {
      true: {
        x: 500,
        width: 250,
      },
    },
  },
})

function App() {
  const [theme, setTheme] = useState<ThemeVars>('light')
  const [showMembers, setShowMembers] = useState(false)

  const [selectedChannel, setSelectedChannel] = useState<string>('welcome')

  const onChannelPress = (id: string) => {
    setSelectedChannel(id)
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={'light'}>
      <div id="app">
        <div id="sidebar">
          <Sidebar
            name="Rarible"
            description="Multichain community-centric NFT marketplace. Create, buy and sell your NFTs."
            membersCount={123}
            onChannelPress={onChannelPress}
            selectedChannel={selectedChannel}
          />
        </div>
        <main id="main">
          <Topbar
            title={`#${selectedChannel}`}
            description="Share random funny stuff with the community. Play nice."
            membersVisisble={showMembers}
            onMembersPress={() => setShowMembers(show => !show)}
          />
          <div id="content">
            <Messages />
          </div>
          <Composer />
        </main>
        <AnimatePresence enterVariant="fromRight" exitVariant="fromLeft">
          {showMembers && (
            <AnimatableDrawer
              id="members"
              key="members"
              animation={[
                'fast',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              opacity={1}
            >
              <SidebarMembers />
            </AnimatableDrawer>
          )}
        </AnimatePresence>
      </div>
    </TamaguiProvider>
  )
}

export default App
