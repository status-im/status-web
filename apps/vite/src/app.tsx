import { useState } from 'react'

import {
  Button,
  Code,
  Heading,
  Label,
  Messages,
  Paragraph,
  Shape,
  Sidebar,
} from '@status-im/components'
import { Stack, TamaguiProvider } from '@tamagui/core'

import tamaguiConfig from '../tamagui.config'
import { Topbar } from './components/topbar'

type ThemeVars = 'light' | 'dark'

function App() {
  const [theme, setTheme] = useState<ThemeVars>('light')
  const [showMembers, setShowMembers] = useState(false)

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <div id="app">
        <div id="sidebar">
          <Sidebar
            name="Rarible"
            description="Multichain community-centric NFT marketplace. Create, buy and sell your NFTs."
            membersCount={123}
          />
        </div>

        <main id="main">
          <Topbar
            membersVisisble={showMembers}
            onMembersPress={() => setShowMembers(show => !show)}
          />
          <div id="content">
            <Messages />

            <Stack width="100%" height="100%" backgroundColor="$background">
              <Stack
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
              >
                <Heading marginBottom={12}>This is an Heading 1</Heading>
                <Heading marginBottom={12} heading="h2">
                  This is an Heading 2
                </Heading>
                <Paragraph weight="semibold" uppercase marginBottom={12}>
                  This is a paragraph
                </Paragraph>
                <Label marginBottom={12}>This is a label</Label>
                <Code marginBottom={12}>This is a code</Code>
                <Paragraph>0x213abc190 ... 121ah4a9e</Paragraph>
                <Paragraph marginVertical={20}>
                  Theme selected - {theme}{' '}
                </Paragraph>
                <Button
                  type="positive"
                  onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  Toogle theme
                </Button>
                <Shape marginTop={20} />
              </Stack>
            </Stack>
          </div>
          <Stack
            backgroundColor="$background"
            justifyContent="center"
            alignItems="center"
          >
            <Paragraph weight="semibold">Composer</Paragraph>
          </Stack>
        </main>

        {showMembers && <div id="members">members</div>}
      </div>
    </TamaguiProvider>
  )
}

export default App
