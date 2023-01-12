import 'expo-dev-client'

import React from 'react'

import { Heading, Shape } from '@status-im/components'
import { TamaguiProvider, Theme } from '@tamagui/core'

import tamaguiConfig from './tamagui.config'

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Theme name="light">
        <Heading>This is an Heading</Heading>
        <Shape />
      </Theme>
    </TamaguiProvider>
  )
}
