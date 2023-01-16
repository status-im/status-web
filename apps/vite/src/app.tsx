import { useState } from 'react'

import {
  Button,
  Code,
  Heading,
  Label,
  Paragraph,
  Shape,
  Sidebar,
} from '@status-im/components'
import { Stack, TamaguiProvider } from '@tamagui/core'

import tamaguiConfig from '../tamagui.config'

type ThemeVars = 'light' | 'dark'

function App() {
  const [theme, setTheme] = useState<ThemeVars>('light')

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <div id="app">
        <div id="sidebar">
          <Sidebar
            name="Rarible"
            description="Multichain community-centric NFT marketplace. Create, buy and sell your NFTs."
            membersCount={123}
          />
        </div>

        <main id="main">
          <div>topbar</div>
          <div>
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
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  Toogle theme
                </button>
                <Shape marginTop={20} />
              </Stack>
            </Stack>
          </div>
          <div>composer</div>
        </main>
      </div>
    </TamaguiProvider>
  )
}

export default App