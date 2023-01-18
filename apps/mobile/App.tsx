// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/namespace */
import 'expo-dev-client'

import { useState } from 'react'

import {
  Code,
  Heading,
  Label,
  Messages,
  Paragraph,
  Shape,
  Sidebar,
} from '@status-im/components'
import { Stack, TamaguiProvider } from '@tamagui/core'
import { useFonts } from 'expo-font'
import { SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'

import tamaguiConfig from './tamagui.config'

type ThemeVars = 'light' | 'dark'

export default function App() {
  const [theme, setTheme] = useState<ThemeVars>('light')
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    // Tamagui does this for you on web, but you need to do it manually on native. Only for the demo. We should seek a better solution.
    UbuntuMono: require('./assets/fonts/UbuntuMono.ttf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <SafeAreaView>
        <ScrollView>
          <Sidebar
            name="Rarible"
            description="Multichain community-centric NFT marketplace. Create, buy and sell your NFTs."
            membersCount={123}
          />
          <Stack
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            paddingTop={20}
            paddingHorizontal={12}
            width="100%"
            backgroundColor="$background"
          >
            <Heading weight="semibold" marginBottom={12}>
              Communities
            </Heading>
            <Heading heading="h2" marginBottom={12}>
              This is an Heading 2
            </Heading>
            <Paragraph weight="semibold" marginBottom={12} uppercase>
              Paragraph uppercased and bolded
            </Paragraph>
            <Paragraph marginBottom={12} uppercase>
              This is a paragraph
            </Paragraph>
            <Label marginBottom={12}>This is a label</Label>
            <Code marginBottom={12}>This is a code line</Code>
            <Paragraph fontWeight="400">0x213abc190 ... 121ah4a9e</Paragraph>
            <Shape marginVertical={20} />

            <Paragraph>Theme selected - {theme}</Paragraph>
            <TouchableOpacity
              onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Paragraph>Toogle theme</Paragraph>
            </TouchableOpacity>

            <Messages />
          </Stack>
        </ScrollView>
      </SafeAreaView>
    </TamaguiProvider>
  )
}
