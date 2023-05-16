import { useEffect, useRef, useState } from 'react'

import { AudioVisualizer } from './audio-visualizer'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof AudioVisualizer> = {
  component: AudioVisualizer,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=5626-158332&t=9spXA4EwpDCL6d4f-0',
    },
  },
  decorators: [
    Story => {
      const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
      const audioContentRef = useRef<AudioContext | null>(null)

      useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          const AudioContext = window.AudioContext
          audioContentRef.current = new AudioContext()
          const streamSource =
            audioContentRef.current.createMediaStreamSource(stream)

          const analyzer = audioContentRef.current.createAnalyser()

          analyzer.fftSize = 256
          streamSource.connect(analyzer)

          setAnalyser(analyzer)
        })

        return () => {
          audioContentRef.current?.close()
        }
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
  name: 'AudioVisualizer',
  args: {},
}

export default meta
