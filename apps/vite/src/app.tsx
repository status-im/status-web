import { cloneElement, useState } from 'react'

import {
  Composer,
  Messages,
  Sidebar,
  SidebarMembers,
  Topbar,
} from '@status-im/components'
import { useScrollPosition } from '@status-im/components/hooks'
import { COMMUNITIES } from '@status-im/components/src/sidebar/mock-data'
import { Stack, styled, TamaguiProvider } from '@tamagui/core'
import { BlurView } from 'expo-blur'
import { AnimatePresence } from 'tamagui'

import tamaguiConfig from '../tamagui.config'

import type { ReactElement, ReactNode } from 'react'

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
  // TODO - this is a hack to get the icon to show up in the topbar when a channel is selected on mount

  const [icon, setIcon] = useState<ReactNode>(
    cloneElement(COMMUNITIES[0].channels[0].icon as ReactElement, {
      hasBackground: false,
    })
  )

  const onChannelPress = (id: string, icon?: ReactNode) => {
    setSelectedChannel(id)
    setIcon(icon)
  }

  const { ref, scrollPos } = useScrollPosition()

  const shouldBlurBackground =
    scrollPos <= ref.current?.scrollHeight - (ref.current?.clientHeight + 32)

  const shouldBlurTopbar = scrollPos >= 56

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={'light'}>
      <div id="app">
        <div id="sidebar" style={{ zIndex: 200 }}>
          <Sidebar
            name="Rarible"
            description="Multichain community-centric NFT marketplace. Create, buy and sell your NFTs."
            membersCount={123}
            onChannelPress={onChannelPress}
            selectedChannel={selectedChannel}
          />
        </div>
        <main id="main">
          <BlurView intensity={40} style={{ zIndex: 100 }}>
            <Topbar
              isBlurred={shouldBlurTopbar}
              backgroundColor="$blurBackground"
              icon={
                icon &&
                cloneElement(icon as ReactElement, { hasBackground: false })
              }
              title={`#${selectedChannel}`}
              description="Share random funny stuff with the community. Play nice."
              membersVisisble={showMembers}
              onMembersPress={() => setShowMembers(show => !show)}
            />
          </BlurView>
          <div id="content" ref={ref}>
            <Messages />
          </div>
          <BlurView
            intensity={40}
            style={{
              zIndex: 100,
              marginTop: -112,
              borderRadius: 20,
            }}
          >
            <Composer
              backgroundColor="$blurBackground"
              paddingBottom={56}
              isBlurred={shouldBlurBackground}
            />
          </BlurView>
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
