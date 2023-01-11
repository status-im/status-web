import 'expo-dev-client'

import React from 'react'

import { Shape } from '@status-im/components'
import { TamaguiProvider } from '@tamagui/core'

import tamaguiConfig from './tamagui.config'

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Shape />
    </TamaguiProvider>
  )
}
