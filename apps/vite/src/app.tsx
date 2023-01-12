import './app.css'

import React, { useState } from 'react'

import { Heading, Shape } from '@status-im/components'
import { TamaguiProvider } from '@tamagui/core'

import tamaguiConfig from '../tamagui.config'
import { Circle } from './components/circle'

type ThemeVars = 'light' | 'dark'
function App() {
  const [theme, setTheme] = useState<ThemeVars>('light')
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={theme}>
      <div>
        <div>
          <Heading>This is an Heading 1</Heading>
          <Heading heading="h2">This is an Heading 2</Heading>
          <Circle />
        </div>
        <div>
          <h1>Theme selected - {theme} </h1>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            Toogle theme
          </button>
        </div>
        <div>
          <h1>UI</h1>
          <Shape />
        </div>
      </div>
    </TamaguiProvider>
  )
}

export default App
