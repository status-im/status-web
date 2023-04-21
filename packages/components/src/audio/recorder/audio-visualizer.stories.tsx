import { useEffect, useState } from 'react'

import { AudioVisualizer } from './audio-visualizer'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof AudioVisualizer> = {
  component: AudioVisualizer,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qSIh8wh9EVdY8S2sZce15n/Composer-for-Web?node-id=7131%3A360528&t=11hKj5jyWVroXgdu-4',
    },
  },
  decorators: [
    Story => {
      // const analyzerRef = useRef<AnalyserNode | null>(null)
      const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
      useEffect(() => {
        console.log('HERE')
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          const AudioContext = window.AudioContext
          const audioContent = new AudioContext()
          const streamSource = audioContent.createMediaStreamSource(stream)

          const analyzer = audioContent.createAnalyser()
          console.log(analyzer)
          analyzer.fftSize = 256
          streamSource.connect(analyzer)

          setAnalyser(analyzer)
        })
      }, [])

      return (
        <Story
          args={{
            analyser,
            width: 400,
          }}
        />
      )
    },
  ],
}

type Story = StoryObj<typeof AudioVisualizer>

export const Default: Story = {
  args: {},
}

export default meta
