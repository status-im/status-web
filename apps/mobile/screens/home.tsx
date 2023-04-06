// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/namespace */

import { Sidebar } from '@status-im/components'
import { Stack } from '@tamagui/core'
import { StatusBar } from 'expo-status-bar'
import { ScrollView } from 'tamagui'

import type { RootStackParamList } from '../App'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  isMinimized?: boolean
}

export const HomeScreen = ({
  navigation,
  onScroll,
  isMinimized,
}: HomeScreenProps) => {
  const onChannelPress = (id: string) => {
    navigation.navigate('Channel', { channelId: id })
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
          />
        </Stack>
      </ScrollView>
    </Stack>
  )
}
