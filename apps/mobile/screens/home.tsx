// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/namespace */
import { useState } from 'react'

import { Sidebar } from '@status-im/components'
import { Stack } from '@tamagui/core'
import { StatusBar } from 'expo-status-bar'
import { ScrollView } from 'tamagui'

export const HomeScreen = ({ navigation, onScroll, isMinimized }) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('welcome')

  const onChannelPress = (id: string) => {
    setSelectedChannel(id)
    navigation.navigate('Channel')
  }

  return (
    <Stack flex={1} backgroundColor="$background">
      <StatusBar style={isMinimized ? 'dark' : 'light'} animated />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} flex={1}>
        <Stack pb={40}>
          <Sidebar
            name="Rarible"
            description="Multichain community-centric NFT marketplace. Create, buy and sell your NFTs."
            membersCount={123}
            onChannelPress={onChannelPress}
            selectedChannel={selectedChannel}
          />
        </Stack>
      </ScrollView>
    </Stack>
  )
}
