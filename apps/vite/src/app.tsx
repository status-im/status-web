import './app.css'

import { Shape } from '@status-im/components'
import { TamaguiProvider } from '@tamagui/core'

import tamaguiConfig from '../tamagui.config'
import { Circle } from './components/circle'

function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <div>
        <div>
          <h1>Vite</h1>
          <Circle />
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
