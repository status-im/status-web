// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/namespace */
import 'expo-dev-client'

import { useMemo, useState } from 'react'

import { Heading, IconButton, Paragraph } from '@felicio/components'
import { Avatar } from '@felicio/components/src/avatar'
import { ArrowLeftIcon, MembersIcon } from '@felicio/icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Stack as View, TamaguiProvider } from '@tamagui/core'
import { useFonts } from 'expo-font'
import { Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AnimatePresence } from 'tamagui'

import { NavigationProvider } from './navigation/provider'
import { ChannelScreen } from './screens/channel'
import { HomeScreen } from './screens/home'
import tamaguiConfig from './tamagui.config'

import type { RouteProp } from '@react-navigation/native'
import type { HeaderBackButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types'

export type RootStackParamList = {
  Home: undefined
  Channel: { channelId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const CustomHeaderLeft = (props: HeaderBackButtonProps) => {
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RootStackParamList, 'Channel'>>()

  return (
    <>
      <IconButton
        icon={<ArrowLeftIcon size={20} />}
        onPress={() => {
          props.canGoBack && navigation.goBack()
        }}
      />
      <Paragraph weight="semibold" marginLeft={12}>
        # {route.params.channelId || 'channel'}
      </Paragraph>
    </>
  )
}

export default function App() {
  const [position, setPosition] = useState(0)

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    // Tamagui does this for you on web, but you need to do it manually on native. Only for the demo. We should seek a better solution.
    UbuntuMono: require('./assets/fonts/UbuntuMono.ttf'),
  })

  const onScroll = event => {
    if (event.nativeEvent.contentOffset.y > 90) {
      setPosition(event.nativeEvent.contentOffset.y)
    } else {
      setPosition(0)
    }
  }

  const showMinimizedHeader = useMemo(() => {
    return position > 90
  }, [position])

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <NavigationProvider>
        <SafeAreaProvider>
          <Stack.Navigator
            screenOptions={{
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen
              name="Home"
              options={{
                headerTransparent: true,
                headerShadowVisible: false,
                header: () => (
                  <View
                    height={100}
                    animation="fast"
                    backgroundColor={
                      showMinimizedHeader ? '$background' : 'transparent'
                    }
                    padding={16}
                    paddingTop={48}
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <AnimatePresence>
                      {showMinimizedHeader && (
                        <View
                          key="header"
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
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Heading color="$textPrimary">Rarible</Heading>
                          <Avatar
                            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
                            size={48}
                            outline
                          />
                        </View>
                      )}
                    </AnimatePresence>
                  </View>
                ),
              }}
            >
              {props => (
                <HomeScreen
                  {...props}
                  onScroll={onScroll}
                  isMinimized={showMinimizedHeader}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Channel"
              component={ChannelScreen}
              options={{
                headerBlurEffect: 'systemUltraThinMaterialLight',
                headerStyle: {
                  backgroundColor: Platform.select({
                    ios: 'transparent',
                    default: 'white',
                  }),
                },
                headerTransparent: true,
                headerShadowVisible: false,
                headerTitle: '',
                headerLeft(props) {
                  return <CustomHeaderLeft {...props} />
                },
                headerRight() {
                  return (
                    <IconButton
                      icon={<MembersIcon size={20} />}
                      onPress={() => {
                        // noop
                      }}
                    />
                  )
                },
              }}
            />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationProvider>
    </TamaguiProvider>
  )
}
