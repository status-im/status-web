import { useState } from 'react'

import {
  Button,
  Code,
  Composer,
  Heading,
  Label,
  Messages,
  Paragraph,
  Shape,
  Sidebar,
  SidebarMembers,
} from '@status-im/components'
import { Stack, styled, TamaguiProvider } from '@tamagui/core'

// import { AnimatePresence } from 'tamagui'
import tamaguiConfig from '../tamagui.config'
import { Topbar } from './components/topbar'

type ThemeVars = 'light' | 'dark'

// const AnimatableDrawer = styled(Stack, {
//   variants: {
//     fromRight: {
//       true: {
//         x: 500,
//         width: 0,
//       },
//     },
//     fromLeft: {
//       true: {
//         x: 500,
//         width: 250,
//       },
//     },
//   },
// })

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
            membersVisisble={showMembers}
            onMembersPress={() => setShowMembers(show => !show)}
          />
          <div id="content">
            <Messages />
          </div>
          <Composer />
        </main>

        {showMembers && (
          <div id="members">
            <SidebarMembers />
          </div>
        )}
      </div>
    </TamaguiProvider>
  )
}

export default App
